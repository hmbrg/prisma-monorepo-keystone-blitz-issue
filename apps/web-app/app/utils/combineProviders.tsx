export default function combineProviders(providers: Array<React.FC<any>>) {
  return providers.reduce((Combined, Provider) => ({ children }) => (
    <Combined>
      <Provider>{children}</Provider>
    </Combined>
  ))
}
