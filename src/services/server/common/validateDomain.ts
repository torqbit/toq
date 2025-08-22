import prisma from "@/lib/prisma";
import { APIResponse } from "@/types/apis";

const commonPlatforms = [
  // Social Networks
  "facebook.com",
  "twitter.com",
  "instagram.com",
  "linkedin.com",
  "pinterest.com",
  "reddit.com",
  "tumblr.com",
  "flickr.com",
  "vkontakte.ru",
  "t.me",
  "weibo.com",
  "wechat.com",
  "whatsapp.com",
  "snapchat.com",
  "tiktok.com",
  "discord.com",
  "slack.com",
  "signal.org",
  "threads.net",
  "mastodon.social",
  "truthsocial.com",
  "nextdoor.com",
  "telegram.org",
  "line.me",
  "vk.com",
  "medium.com",
  "google.com",
  "quora.com",

  // Video & Streaming
  "youtube.com",
  "vimeo.com",
  "twitch.tv",
  "dailymotion.com",

  // Music & Audio
  "spotify.com",
  "soundcloud.com",
  "mixcloud.com",
  "bandcamp.com",

  // Creative & Design
  "deviantart.com",
  "behance.net",
  "dribbble.com",

  // Local & Reviews
  "foursquare.com",
  "yelp.com",
  "tripadvisor.com",

  // Other
  "airbnb.com",
  "couchsurfing.com",
  "goodreads.com",
  "letterboxd.com",
  "last.fm",
  "github.com",
  "gitlab.com",
  "bitbucket.org",
  "stackoverflow.com",
  "producthunt.com",
  "angel.co",
  "crunchbase.com",
];

/**
 * A function to validate the domain, which checks for common platforms like youtube.com, facebook.com etc.
 */
export const validateDomain = async (domain: string) => {
  // check if the domain is part of common domains list
  if (commonPlatforms.includes(domain)) {
    return new APIResponse(false, 400, "Commonly used domain is not valid.");
  } else {
    //extract the brand name from the domain, such that it ignores www or any other prefix
    const domainParts = domain.split(".");
    const brandName = domainParts.length > 2 ? domainParts[1] : domainParts[0];
    const domainDB =
      process.env.NODE_ENV === "development"
        ? `${brandName}${process.env.COOKIE_DOMAIN}:3000`
        : `${brandName}${process.env.COOKIE_DOMAIN}`;

    // check if tenant exists with this domain name or not
    const tenant = await prisma.tenant.findFirst({
      where: {
        domain: domainDB,
      },
    });

    if (tenant) {
      return new APIResponse(false, 400, "A workspace with this domain already exists.");
    } else {
      return new APIResponse(true, 200, "Domain is valid");
    }
  }
};
