import { motion } from "framer-motion";

interface VideoCardProps {
  id: number;
  title: string;
  thumbnail: string;
  duration?: string;
  readTime?: string;
  views: number;
  type: "video" | "article";
  url: string;
}

export function VideoCard({ title, thumbnail, duration, readTime, views, type, url }: VideoCardProps) {
  const handleClick = () => {
    if (type === "video" && url.includes("youtube")) {
      window.open(url, "_blank");
    } else {
      // For articles or internal links
      console.log("Opening:", url);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
    >
      <div className="relative">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-32 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <div className="bg-white bg-opacity-80 rounded-full p-2">
            {type === "video" ? "▶️" : "📖"}
          </div>
        </div>
        {(duration || readTime) && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            {duration || readTime}
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm mb-2 line-clamp-2">{title}</h3>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{type === "video" ? "Video" : "Artikel"}</span>
          <span>{views.toLocaleString("id-ID")} views</span>
        </div>
      </div>
    </motion.div>
  );
}
