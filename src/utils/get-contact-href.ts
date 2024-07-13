const getContactHref = (name: string, contact: string) => {
  const hrefs: { [key: string]: string } = {
    email: `mailto:${contact}`,
    telegram: `https://t.me/${contact}`,
    medium: `https://medium.com/${contact}`,
    github: `https://github.com/${contact}`,
    gitlab: `https://www.gitlab.com/${contact}`,
    codepen: `https://www.codepen.io/${contact}`,
    twitter: `https://www.twitter.com/${contact}`,
    soundcloud: `https://soundcloud.com/${contact}`,
    facebook: `https://www.facebook.com/${contact}`,
    instagram: `https://www.instagram.com/${contact}`,
    linkedin: `https://www.linkedin.com/in/${contact}`,
    youtube: `https://www.youtube.com/channel/${contact}`,
    mastodon: `${contact}`,
    bluesky: `https://bsky.app/profile/${contact}.bsky.social`,
    lenster: `https://lenster.xyz/u/${contact}.lens`,
    showtime: `https://tryshowtime.com/${contact}`,
    farcaster: `https://fcast.me/${contact}`,
  };

  return hrefs[name] ?? contact;
};

export default getContactHref;
