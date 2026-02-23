import { useParams } from "react-router-dom";

function TrekDetails() {
  const { id } = useParams();

  // Prevent crash if id is undefined
  const formattedName = id
    ? id
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase())
    : "Trek Details";

  return (
    <div className="container py-5">
      <h2 className="fw-bold text-center mb-4 text-success">
        {formattedName}
      </h2>

      <p className="text-center">
        Detailed information about this trek will be added soon.
      </p>
    </div>
  );
}

export default TrekDetails;