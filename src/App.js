import "./App.css";
// import BottomSheet from "./BottomSheet";
// import ChunkedVideoPlayer from "./ChunkerVIdeoPlayer";
import VerticalCarousel from "./VerticalCarousel";

function App() {
  const data = [
    { name: "Slide 1", color: "#F34A4E" },
    { name: "Slide 2", color: "#FED0D1" },
    { name: "Slide 3", color: "#F34A4E" },
    { name: "Slide 4", color: "#FED0D1" },
  ];

  return (
    <div className="App">
      <VerticalCarousel
        initialIndex={2}
        onSlideChange={(index) => console.log("onSnap", index)}
      >
        {data.map((item, index) => (
          <div
            key={index}
            style={{
              height: "100%",
              backgroundColor: item.color,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
            }}
          >
            <h1>{item.name}</h1>
          </div>
        ))}
      </VerticalCarousel>
      {/* <BottomSheet>
        <h2>Draggable Bottom Sheet Modal</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi
          distinctio illo temporibus consectetur quos veritatis tempore incidunt
          dolorem alias aperiam et sapiente ex eaque natus, nesciunt, itaque a
          ipsam numquam rerum dolores voluptatum quia deleniti ullam vero! Quae,
          officiis esse sunt vitae similique cum vel corporis assumenda,
          nesciunt, repellat dignissimos?
        </p>
      </BottomSheet>
      <ChunkedVideoPlayer
        autoPlay
        controls
        preloadPercentage={10}
        // videoUrl="https://video.housingcdn.com/721857c7/18e615349cfa0f2b8f599aa61e7/original.mp4"
        videoUrl="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
        // videoUrl="https://nickdesaulniers.github.io/netfix/demo/frag_bunny.mp4"
        width={200}
        height={600}
        poster="https://housing-images.n7net.in/90450d75/18e614fe74e43a940cc3555556f/v0/medium.jpeg"
        style={{ width: "100%", height: "100%" }}
      /> */}
    </div>
  );
}

export default App;

// storiesVideoTemplate1Url
// :
// "https://video.housingcdn.com/721857c7/18e615349cfa0f2b8f599aa61e7/original.mp4"
// storiesVideoTemplate2Url
// :
// "https://video.housingcdn.com/721857c7/18e6153633a88f6fcd8f4f1edbd/original.mp4"

// storiesVideoTemplate1Url
// :
// "https://video.housingcdn.com/721857c7/18e615349cfa0f2b8f599aa61e7/original.mp4"
// storiesVideoTemplate2Url
// :
// "https://video.housingcdn.com/721857c7/18e6153633a88f6fcd8f4f1edbd/original.mp4"
