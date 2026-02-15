import { useParams } from "react-router-dom";

function TourDetails() {
  const { tourName } = useParams();

  return (
    <div className="container py-5">
      <h2>{tourName.replaceAll("-", " ")}</h2>
      <p className="mt-3">Tour details coming soon...</p>
    </div>
  );
}

export default TourDetails;
