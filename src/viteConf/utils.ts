/**
 * 仅在vite.config.ts中使用的方法
 */
// 读取所有要处理的环境变量配置文件.env
export const wrapperEnv = (envConf: Recordable): ViteEnv => {
  const ret: any = {}
  for (const envName of Object.keys(envConf)) {
    let realName = envConf[envName].replace(/\\n/g, '\n')
    realName =
      realName === 'true' ? true : realName === 'false' ? false : realName
    if (envName === 'VITE_PORT') {
      realName = Number(realName)
    }
    if (envName === 'VITE_PROXY') {
      try {
        realName = JSON.parse(realName)
      } catch (error) {
        console.log(error)
      }
    }
    ret[envName] = realName
    process.env[envName] = realName
  }
  return ret
}
