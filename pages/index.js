import Head from 'next/head'
// import ClientOnly from '../components/ClientsOnly'
import User from '../components/Users'

export default function Home() {
  return (
    <>
      <Head>
        <title>GraphQl Next</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <main>
        <h2 className='title'>Welcome to GraphQL Next APP</h2>
          <User/>
      </main>
    </>
  )
}
