import { Link } from "react-router-dom";

function SouthIndiaTours() {

  const packages = [
    "Munnar Thekkady Alleppey",
    "Kerala with Kanyakumari",
    "Adiyogi Rameshwaram Madurai",
    "Adiyogi Rameshwaram Madurai Kanyakumari",
    "Coorg Chikmagalur Mysore",
    "Pondicherry Auroville",

    // Extra from 2nd image
    "Goa Backpacking",
    "Hampi Gokarna Murudeshwar",
    "Adiyogi with Rameshwaram",
    "Hampi Backpacking",
    "Dandeli Gokarna Murudeshwar",
  ];

  return (
    <div className="container py-5">
      <h2 className="mb-4">South India Tours</h2>

      <div className="row">
        {packages.map((pkg, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <Link
              to={`/tours/southindia/${pkg.replaceAll(" ", "-")}`}
              className="card p-3 text-decoration-none text-dark shadow-sm"
            >
              {pkg}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SouthIndiaTours;
