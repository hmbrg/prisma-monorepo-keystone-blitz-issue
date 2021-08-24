import { LazyMotion, m } from "framer-motion"

// Make sure to return the specific export containing the feature bundle.
export default function loadFeatures() {
  return import("./framerMotionDomMax").then((res) => res.default)
}
