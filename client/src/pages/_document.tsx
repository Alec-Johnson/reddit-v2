import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel='icon' type='image/svg+xml' href='/reddit.svg'/>
          <meta property="og:site_name" content="Reddit V2" />
          {/* <meta property="twitter:site" content="@RedditV2" /> */}
          <meta property="twitter:card" content="summary" />
          <meta property="og:type" content="website" />
          <meta property="og:image" content={`${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}/reddit.svg`} />
          <meta property="twitter:image" content={`${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}/reddit.svg`} />
          <link rel="preconnect" href="https://fonts.googleapis.com"/>
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='true'/>
          <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@100;200;300;400;500;600&display=swap" rel="stylesheet"/>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
        </Head>
        <body className='font-body' style={{ backgroundColor: '#DAE0E6' }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument