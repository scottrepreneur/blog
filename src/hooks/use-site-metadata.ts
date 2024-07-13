import { graphql, useStaticQuery } from "gatsby";

const useSiteMetadata = () => {
  const { site } = useStaticQuery(graphql`
    query SiteMetaData {
      site {
        siteMetadata {
          author {
            bio
            name
            pronunciation
            workingOn {
              link
              place
              position
            }
            photo
            contacts {
              rss
              email
              gitlab
              medium
              github
              twitter
              codepen
              youtube
              facebook
              linkedin
              telegram
              instagram
              soundcloud
              mastodon
              showtime
              lenster
              farcaster
            }
          }
          menu {
            path
            label
          }
          url
          title
          subtitle
          copyright
          disqusShortname
          farcasterUrl
        }
      }
    }
  `);

  return site?.siteMetadata || {};
};

export default useSiteMetadata;
