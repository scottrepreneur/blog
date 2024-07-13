---
template: post
title: Adding Farcaster Comments To Gatsby
draft: false
date: 2022-12-29T08:35:24.152Z
description: "Gatsby makes it super easy to add Farcaster comments inline."
callToFeedback: "What's your favorite part of open developer systems?"
category: "Dev"
tags:
  - gatsby
  - farcaster
  - comments
---

With [inspiration from Matthias](https://portfolio.iammatthias.com/md/1670705920366), I hacked in comments to my site using the [Searchcaster API](https://searchcaster.xyz) and [Farcaster Protocol](https://farcaster.xyz). I'd walk you through it here, but it was largely the same implementation so check out his post for details. The trickiest bit was the [recursion for nesting comments nicely](https://github.com/scottrepreneur/blog/blob/master/src/components/Post/Comments/TopLevelComment.tsx#L69), so do watch that.

I'm hoping I can find some time in 2023 to create a Gatsby plugin for this so others can do this even easier. The [current template](https://github.com/alxshelepenok/gatsby-starter-lumen) comes with Disqus comments out of the box, but it'd be great to give folks other accessible options for comments.

### UX considerations

I'll extend Matthias' post a bit with some UX considerations I was thinking about when implementing this.

- This naive approach will show all comments regardless of their moderation. Without a server, moderation gets tricky also. For a plugin, I'd probably just include options to exclude specific cast IDs so they can be manually removed at least.

- I'd like to add a "reply" button to each comment that would allow for replies inline. This would be a great way to get people to engage with the content and foster some use of Farcaster. I need to look into authenticating with Farcaster and how to do that outside a native client.

- [Discove](https://discove.xyz) has provided a pretty great client for Farcaster so I've linked there in most cases, but need to consider how to handle more client-less protocol links as the ecosystem grows.

That's all for today. Hope you have a great wrap to 2022. See you in the new year!
