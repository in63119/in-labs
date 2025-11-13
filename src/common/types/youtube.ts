export type YouTubeVideo = {
  id: string;
  title: string;
  keyPoints: string[];
};

export type VideoForm = {
  videoId: string;
  title: string;
  keyPoints: string[];
};

export type RawVideoTuple = [string, string, string[]];

export type SaveVideoResponse = {
  ok: boolean;
};

export type LoadVideoResponse = {
  videos: YouTubeVideo[];
};

export type EditVideoResponse = {
  vedio: YouTubeVideo;
};

export type DeleteVideoResponse = {
  ok: boolean;
};
