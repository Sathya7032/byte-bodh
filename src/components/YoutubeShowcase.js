import React from "react";

function YouTubeShowcase() {
  const videos = [
    {
      id: "video1",
      title: "Java animated videos for Beginners",
      embedId: "06NxbTAtVGk?si=58XvZOeDZ-B9y7i7",
    },
    {
      id: "video2",
      title: "Java animated videos for Beginners",
      embedId: "gLNrqolU-R8?si=DTarWKZUHKcn8mET",
    },
    {
      id: "video3",
      title: "Java animated videos for Beginners",
      embedId: "5JlO9WoH1Pw?si=TYjf-vhVG3VWXY0L",
    },
    {
      id: "video4",
      title: "Java animated videos for Beginners",
      embedId: "7Cfwnndatn0?si=MbXio3YdYbyUOBTj",
    },
  ];

  return (
    <section className="relative bg-gradient-to-br from-white to-slate-50 py-20">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,_rgba(2,132,199,0.05)_0%,_transparent_70%)]" />

      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block mb-4 px-6 py-3 text-sm font-medium text-white rounded-full bg-gradient-to-r from-sky-600 to-indigo-500">
            Free Learning Resources
          </span>

          <h2 className="text-4xl font-bold text-slate-900 mb-4 leading-tight">
            Master IT Skills with Our{" "}
            <span className="bg-gradient-to-r from-sky-600 to-indigo-500 bg-clip-text text-transparent">
              Free Tutorials
            </span>
          </h2>

          <p className="max-w-2xl mx-auto text-slate-500 text-lg leading-relaxed">
            Access high-quality, free tutorials covering essential IT skills for
            startups and small businesses. Learn at your own pace and build your
            technical expertise without any cost.
          </p>
        </div>

        {/* Videos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {videos.map((video) => (
            <div
              key={video.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-md overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="relative w-full pt-[56.25%] bg-black overflow-hidden rounded-t-2xl">
                <iframe
                  src={`https://www.youtube.com/embed/${video.embedId}`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full transition-transform duration-300 hover:scale-[1.02]"
                />
              </div>

              <h5 className="px-6 py-6 text-slate-900 font-semibold text-lg leading-snug">
                {video.title}
              </h5>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href="https://www.youtube.com/@ByteBodh"
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-flex items-center px-10 py-4 text-lg font-semibold text-white rounded-xl bg-gradient-to-r from-sky-600 to-indigo-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-500/40 overflow-hidden"
          >
            <span className="absolute inset-0 -left-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-500 hover:left-full" />
            Subscribe for More Free Tutorials
          </a>
        </div>
      </div>
    </section>
  );
}

export default YouTubeShowcase;
