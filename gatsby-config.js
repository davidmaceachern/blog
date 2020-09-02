'use strict';

const siteConfig = require('./config.js');
const postCssPlugins = require('./postcss-config.js');

module.exports = {
  pathPrefix: siteConfig.pathPrefix,
  siteMetadata: {
    url: siteConfig.url,
    title: siteConfig.title,
    subtitle: siteConfig.subtitle,
    copyright: siteConfig.copyright,
    disqusShortname: siteConfig.disqusShortname,
    menu: siteConfig.menu,
    author: siteConfig.author
  },
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/content`,
        name: 'pages'
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/static/media`,
        name: 'media'
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'css',
        path: `${__dirname}/static/css`
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'assets',
        path: `${__dirname}/static`
      }
    },
    {
      resolve: 'gatsby-plugin-feed',
      options: {
        query: `
          {
            site {
              siteMetadata {
                site_url: url
                title
                description: subtitle
              }
            }
          }
        `,
        feeds: [{
          serialize: ({ query: { site, allMarkdownRemark } }) => (
            allMarkdownRemark.edges.map((edge) => ({
              ...edge.node.frontmatter,
              description: edge.node.frontmatter.description,
              date: edge.node.frontmatter.date,
              url: site.siteMetadata.site_url + edge.node.fields.slug,
              guid: site.siteMetadata.site_url + edge.node.fields.slug,
              custom_elements: [{ 'content:encoded': edge.node.html }]
            }))
          ),
          query: `
              {
                allMarkdownRemark(
                  limit: 1000,
                  sort: { order: DESC, fields: [frontmatter___date] },
                  filter: { frontmatter: { template: { eq: "post" }, draft: { ne: true } } }
                ) {
                  edges {
                    node {
                      html
                      fields {
                        slug
                      }
                      frontmatter {
                        title
                        date
                        template
                        draft
                        description
                      }
                    }
                  }
                }
              }
            `,
          output: '/rss.xml',
          title: siteConfig.title
        }]
      }
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          'gatsby-remark-relative-images',
          {
            resolve: 'gatsby-remark-katex',
            options: {
              strict: 'ignore'
            }
          },
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 960,
              withWebp: true,
              ignoreFileExtensions: [],
            }
          },
          {
            resolve: 'gatsby-remark-responsive-iframe',
            options: { wrapperStyle: 'margin-bottom: 1.0725rem' }
          },
          'gatsby-remark-autolink-headers',
          'gatsby-remark-prismjs',
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants',
          'gatsby-remark-external-links'
        ]
      }
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    'gatsby-plugin-netlify',
    {
      resolve: 'gatsby-plugin-netlify-cms',
      options: {
        modulePath: `${__dirname}/src/cms/index.js`,
      }
    },
    {
      resolve: 'gatsby-plugin-google-gtag',
      options: {
        trackingIds: [siteConfig.googleAnalyticsId],
        pluginConfig: {
          head: true,
        },
      },
    },
    {
      resolve: 'gatsby-plugin-sitemap',
      options: {
        query: `
          {
            site {
              siteMetadata {
                siteUrl: url
              }
            }
            allSitePage(
              filter: {
                path: { regex: "/^(?!/404/|/404.html|/dev-404-page/)/" }
              }
            ) {
              edges {
                node {
                  path
                }
              }
            }
          }
        `,
        output: '/sitemap.xml',
        serialize: ({ site, allSitePage }) => allSitePage.edges.map((edge) => ({
          url: site.siteMetadata.siteUrl + edge.node.path,
          changefreq: 'daily',
          priority: 0.7
        }))
      }
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: siteConfig.title,
        short_name: siteConfig.title,
        start_url: '/',
        background_color: '#FFF',
        theme_color: '#F7A046',
        display: 'standalone',
        icon: 'static/icon.svg'
      },
    },
    'gatsby-plugin-offline',
    'gatsby-plugin-catch-links',
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-sass',
      options: {
        postCssPlugins: [...postCssPlugins],
        cssLoaderOptions: {
          camelCase: false,
        }
      }
    },
    'gatsby-plugin-flow',
    'gatsby-plugin-optimize-svgs',
    {
      resolve: `gatsby-plugin-goatcounter`,
      options: {
        // Either `code` or `selfHostUrl` is required.
        // REQUIRED IF USING HOSTED GOATCOUNTER! https://[my_code].goatcounter.com
        code: 'https://dmac.goatcounter.com',

        // REQUIRED IF USING SELFHOSTED GOATCOUNTER!
        // selfHostUrl: `https://davidmaceachern.com`,

        // ALL following settings are OPTIONAL

        // Avoids sending pageview hits from custom paths
        exclude: [],

        // Delays sending pageview hits on route update (in milliseconds)
        pageTransitionDelay: 0,

        // Defines where to place the tracking script
        // boolean `true` in the head and `false` in the body
        head: false,

        // Set to true to include a gif to count non-JS users
        pixel: false,

        // Allow requests from local addresses (localhost, 192.168.0.0, etc.)
        // for testing the integration locally.
        // TIP: set up a `Additional Site` in your GoatCounter settings
        // and use its code conditionally when you `allowLocal`, example below
        allowLocal: false,

        // Override the default localStorage key more below
        localStorageKey: 'skipgc',

        // Set to boolean true to enable referrer set via URL parameters
        // Like example.com?ref=referrer.com or example.com?utm_source=referrer.com
        // Accepts a function to override the default referrer extraction
        // NOTE: No Babel! The function will be passes as is to your websites <head> section
        // So make sure the function works as intended in all browsers you want to support
        referrer: false,

        // Setting it to boolean true will clean the URL from
        // `?ref` & `?utm_` parameters before sending it to GoatCounter
        // It uses `window.history.replaceState` to clean the URL in the
        // browser address bar as well.
        // This is to prevent ref tracking ending up in your users bookmarks.
        // All parameters other than `ref` and all `utm_` will stay intact
        urlCleanup: false,
      },
    },
  ]
};
