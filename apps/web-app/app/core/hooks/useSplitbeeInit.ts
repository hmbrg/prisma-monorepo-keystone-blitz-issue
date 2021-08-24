import { useEffect } from "react"

import splitbee from "@splitbee/web"

export const useSplitbeeInit = () => {
  useEffect(() => {
    splitbee.init({
      scriptUrl: "/bee.js",
      apiUrl: "/_hive",
      token: process.env.SPLITBEE_TOKEN,
    })
  }, [])
}
