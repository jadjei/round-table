import { createContext } from 'react'

type GraphQL = {
  type: 'graphql'
  URI: string
}

type QueryAPI = GraphQL

type Network = 'mainnet' | 'testnet' | 'preview'

const parseNetwork = (text: string): Network => {
  switch (text) {
    case 'mainnet': return 'mainnet'
    case 'testnet': return 'testnet'
    case 'preview': return 'preview'
    default: throw new Error('Unknown network')
  }
}

type Config = {
  network: Network
  queryAPI: QueryAPI
  submitAPI: string[]
  SMASH: string
  gunPeers: string[]
}

const isMainnet = (config: Config) => config.network === 'mainnet'

// Update Blockfrost endpoints with appropriate network
const getBlockfrostUrl = (network: Network): string => {
  switch (network) {
    case 'mainnet': return 'https://cardano-mainnet.blockfrost.io/api/v0/graphql'
    case 'testnet': return 'https://cardano-testnet.blockfrost.io/api/v0/graphql'
    case 'preview': return 'https://cardano-preview.blockfrost.io/api/v0/graphql'
    default: return 'https://cardano-mainnet.blockfrost.io/api/v0/graphql'
  }
}

// Default Dandelion endpoints
//https://graphql-api.mainnet.dandelion.link'
const defaultGraphQLDandelion = 'https://graphql.panl.org/'
const defaultGraphQLTestnet = 'https://graphql.preview.lidonation.com/graphql'

const defaultSubmitURIMainnet = [
  'https://adao.panl.org',
  'https://submit-api.apexpool.info/api/submit/tx'
]
const defaultSubmitURITestnet = [
  'https://sa-preview.apexpool.info/api/submit/tx',
  'https://preview-submit.panl.org'
]
const defaultSMASHMainnet = 'https://mainnet-smash.panl.org'
const defaultSMASHTestnet = 'https://preview-smash.panl.org'

const defaultConfig: Config = {
  network: 'mainnet',
  queryAPI: { type: 'graphql', URI: getBlockfrostUrl('mainnet') },
  submitAPI: defaultSubmitURIMainnet,
  SMASH: defaultSMASHMainnet,
  gunPeers: []
}

const createConfig = (): Config => {
  const network = parseNetwork(process.env.NEXT_PUBLIC_NETWORK ?? 'mainnet')

  // Determine whether to use Blockfrost or Dandelion
  const useBlockfrost = process.env.NEXT_PUBLIC_USE_BLOCKFROST === 'true'
  
  // Set appropriate default GraphQL endpoint based on configuration
  const defaultGraphQL = useBlockfrost 
    ? getBlockfrostUrl(network) 
    : (network === 'mainnet' ? defaultGraphQLDandelion : defaultGraphQLTestnet)

  const defaultSubmitURI = network === 'mainnet' ? defaultSubmitURIMainnet : defaultSubmitURITestnet
  const grapQLURI = process.env.NEXT_PUBLIC_GRAPHQL ?? defaultGraphQL
  const submitEnv = process.env.NEXT_PUBLIC_SUBMIT
  const submitURI = submitEnv ? submitEnv.split(';') : defaultSubmitURI
  const defaultSMASH = network === 'mainnet' ? defaultSMASHMainnet : defaultSMASHTestnet
  const SMASH = process.env.NEXT_PUBLIC_SMASH ?? defaultSMASH
  const gunPeers = (process.env.NEXT_PUBLIC_GUN ?? '').split(';')

  return {
    network,
    queryAPI: { type: 'graphql', URI: grapQLURI },
    submitAPI: submitURI,
    SMASH,
    gunPeers
  }
}

const config = createConfig()

const ConfigContext = createContext<[Config, (x: Config) => void]>([defaultConfig, (_) => {}])

export type { Config, Network }
export { ConfigContext, config, isMainnet }
