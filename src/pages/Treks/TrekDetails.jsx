import { useParams } from "react-router-dom";

function TrekDetails() {
  const { trekName } = useParams();

  return (
    <div className="container py-5">
      <h2 className="fw-bold text-center text-capitalize">
        {trekName.replaceAll("-", " ")}
      </h2>

      <p className="text-center mt-3">
        Detailed information about this trek will be added soon.
      </p>
    </div>
  );
}

export default TrekDetails;
