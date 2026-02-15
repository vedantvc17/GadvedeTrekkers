import { Link } from "react-router-dom";

function UttarakhandTours() {

  const packages = [
    "Kedarnath Yatra",
    "Kedarnath Tungnath Rishikesh",
    "Kedarnath Tungnath Badrinath",
    "Kedarnath Badrinath",
    "Char Dham Yatra",
    "Chopta Chandrashila Rishikesh",
    "Nainital Jim Corbett Mussoorie Rishikesh",
    "Auli Chopta Rishikesh",
  ];

  return (
    <div className="container py-5">
      <h2 className="mb-4">Uttarakhand Tours</h2>

      <div className="row">
        {packages.map((pkg, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <Link
              to={`/tours/uttarakhand/${pkg.replaceAll(" ", "-")}`}
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

export default UttarakhandTours;
