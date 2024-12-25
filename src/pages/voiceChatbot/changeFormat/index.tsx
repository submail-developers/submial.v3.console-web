import React, { useState } from 'react'
import './index.scss'

// 辅助函数：降混为单声道
const downmixToMono = (channels) => {
  if (channels.length === 1) return channels[0]

  const length = channels[0].length
  const monoChannel = new Float32Array(length)
  for (let i = 0; i < length; i++) {
    let sum = 0
    for (let channel of channels) {
      sum += channel[i]
    }
    monoChannel[i] = sum / channels.length
  }
  return [monoChannel]
}

// 辅助函数：重采样到8000 Hz
const resampleTo8kHz = (audioBuffer, targetSampleRate = 8000) => {
  const sourceSampleRate = audioBuffer.sampleRate
  const length = Math.floor(audioBuffer.duration * targetSampleRate)
  const numChannels = audioBuffer.numberOfChannels
  const channels = new Array(numChannels)

  for (let i = 0; i < numChannels; i++) {
    channels[i] = new Float32Array(length)
    const inputChannel = audioBuffer.getChannelData(i)
    for (let j = 0; j < length; j++) {
      const ratio = j / length
      const index = ratio * (inputChannel.length - 1)
      const lowerIndex = Math.floor(index)
      const higherIndex = Math.min(lowerIndex + 1, inputChannel.length - 1)
      const fraction = index - lowerIndex
      channels[i][j] =
        (1 - fraction) * inputChannel[lowerIndex] +
        fraction * inputChannel[higherIndex]
    }
  }

  return {
    numberOfChannels: numChannels,
    sampleRate: targetSampleRate,
    getChannelData: function (channel) {
      return channels[channel]
    },
    duration: length / targetSampleRate,
  }
}

// 辅助函数：交织多声道数据
const interleave = (input, length) => {
  const result = new Float32Array(length * input.length)
  let index = 0
  let inputIndex = 0

  while (index < length) {
    for (let channel = 0; channel < input.length; channel++) {
      result[inputIndex++] = input[channel][index]
    }
    index++
  }

  return result
}

// 辅助函数：浮点型PCM转16位整型PCM
const floatTo16BitPCM = (float32Array, length) => {
  const int16Array = new Int16Array(length)
  for (let i = 0; i < length; i++) {
    let clamped = Math.max(-1, Math.min(1, float32Array[i]))
    int16Array[i] = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff
  }
  return int16Array
}

// 辅助函数：构建WAV文件头
const u32ToArray = (i) => [
  i & 0xff,
  (i >> 8) & 0xff,
  (i >> 16) & 0xff,
  (i >> 24) & 0xff,
]
const u16ToArray = (i) => [i & 0xff, (i >> 8) & 0xff]

const pcmToWav = (pcm, sampleRate, numChannels = 1, bitsPerSample = 16) => {
  let header = {
    chunkId: [0x52, 0x49, 0x46, 0x46], // "RIFF"
    format: [0x57, 0x41, 0x56, 0x45], // "WAVE"
    subChunk1Id: [0x66, 0x6d, 0x74, 0x20], // "fmt "
    subChunk1Size: 16,
    audioFormat: 1, // PCM
    numChannels,
    sampleRate,
    byteRate: 0,
    blockAlign: 0,
    bitsPerSample,
    subChunk2Id: [0x64, 0x61, 0x74, 0x61], // "data"
    subChunk2Size: 0,
    chunkSize: 0, // 定义chunkSize
  }

  header.blockAlign = (header.numChannels * header.bitsPerSample) >> 3
  header.byteRate = header.blockAlign * header.sampleRate
  header.subChunk2Size = pcm.byteLength
  header.chunkSize = 36 + header.subChunk2Size

  let wavHeader = header.chunkId.concat(
    u32ToArray(header.chunkSize), // 包含chunkSize
    header.format,
    header.subChunk1Id,
    u32ToArray(header.subChunk1Size),
    u16ToArray(header.audioFormat),
    u16ToArray(header.numChannels),
    u32ToArray(header.sampleRate),
    u32ToArray(header.byteRate),
    u16ToArray(header.blockAlign),
    u16ToArray(header.bitsPerSample),
    header.subChunk2Id,
    u32ToArray(header.subChunk2Size),
  )

  let wavHeaderUnit8 = new Uint8Array(wavHeader)
  let mergedArray = new Uint8Array(wavHeaderUnit8.length + pcm.byteLength)
  mergedArray.set(wavHeaderUnit8)
  mergedArray.set(new Uint8Array(pcm), wavHeaderUnit8.length)

  let blob = new Blob([mergedArray], { type: 'audio/wav' })
  let blobUrl = URL.createObjectURL(blob)

  return blobUrl
}

const Change = () => {
  const [status, setStatus] = useState('')
  const [downloadLinks, setDownloadLinks] = useState([])

  const handleFileChange = (event) => {
    const files = event.target.files
    if (!files.length) {
      alert('请先选择一个或多个音频文件')
      return
    }
    convertFiles(files)
  }

  const convertFiles = async (files) => {
    setStatus('正在处理...')
    setDownloadLinks([]) // 清空之前的下载链接

    try {
      await Promise.all(
        Array.from(files).map((file, index) =>
          processFile(file, index, files.length),
        ),
      )
      setStatus('所有文件转换完成，可以下载了！')
    } catch (error) {
      console.error('处理文件时发生错误:', error)
      setStatus('处理文件时发生错误，请重试。')
    }
  }

  const processFile = (file, index, total) => {
    return new Promise<void>(async (resolve, reject) => {
      const reader = new FileReader()
      reader.onload = async (event) => {
        try {
          if (!(event.target && event.target.result instanceof ArrayBuffer)) {
            throw new Error('文件读取失败: 结果不是ArrayBuffer')
          }
          const arrayBuffer = event.target.result
          const audioContext = new AudioContext() // 使用标准的AudioContext

          // decodeAudioData now returns a promise in modern browsers
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
          if (!audioBuffer) throw new Error('解码失败')

          // 强制转换为单声道
          const monoChannels = downmixToMono(
            Array.from({ length: audioBuffer.numberOfChannels }, (_, i) =>
              audioBuffer.getChannelData(i),
            ),
          )

          // 强制转换为8000 Hz
          const resampledBuffer = resampleTo8kHz({
            numberOfChannels: 1,
            sampleRate: 8000,
            getChannelData: function () {
              return monoChannels[0]
            },
            duration: audioBuffer.duration,
          })

          // Extract PCM data from the resampled buffer
          const length = resampledBuffer.duration * resampledBuffer.sampleRate
          const channels = [resampledBuffer.getChannelData(0)]

          // Convert Float32Array to Int16Array (16-bit PCM)
          const pcmData = interleave(channels, length)
          const int16Data = floatTo16BitPCM(pcmData, length)

          const wavUrl = pcmToWav(int16Data.buffer, 8000, 1, 16) // 16-bit PCM, 8000 Hz, 1 channel
          addDownloadLink(wavUrl, `converted_${index}_8kHz_mono.wav`)

          resolve()
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = (error) => {
        reject(error)
      }
      reader.readAsArrayBuffer(file)
    })
  }

  const addDownloadLink = (blobUrl, fileName) => {
    setDownloadLinks((prevLinks) => [
      ...prevLinks,
      { url: blobUrl, name: fileName },
    ])
  }

  return (
    <div className='converter-container'>
      <div className='fn26'>
        格式转换{' '}
        <span className='fn20' style={{ color: '#666666' }}>
          ( 8000Hz单声道WAV )
        </span>
      </div>
      <div className='file-input-wrapper'>
        <input
          type='file'
          id='audioFileInput'
          accept='audio/*'
          multiple
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <label htmlFor='audioFileInput' className='custom-file-input m-t-10'>
          选择文件
        </label>
      </div>
      {/* <button onClick={convertFiles} className="convert-button">
        转换为8000Hz单声道WAV
      </button> */}
      <p>{status}</p>
      <div className='download-links'>
        {downloadLinks.map((link, index) => (
          <a
            key={index}
            href={link.url}
            download={link.name}
            className='download-link'>
            下载 {link.name}
          </a>
        ))}
      </div>
    </div>
  )
}

export default Change
