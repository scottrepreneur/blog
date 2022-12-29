interface Frontmatter {
  date: string;
  title: string;
  slug?: string;
  category: string;
  template: string;
  description?: string;
  tags?: Array<string>;
  socialImage?: {
    publicURL: string;
  };
  callToFeedback?: string;
}

export default Frontmatter;
