import React, { useState } from "react";
import "./App.css";

const initialPets = [
  {
    id: 1,
    name: "Max",
    breed: "Golden Retriever",
    age: "2 Years",
    type: "Dog",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=500",
    description: "Friendly and playful dog looking for a loving home."
  },
  {
    id: 2,
    name: "Luna",
    breed: "Persian Cat",
    age: "1 Year",
    type: "Cat",
    image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=500",
    description: "Calm and adorable cat who loves attention."
  },
  {
    id: 3,
    name: "Charlie",
    breed: "Beagle",
    age: "3 Years",
    type: "Dog",
    image: "https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=500",
    description: "Energetic and friendly dog."
  },
  {
    id: 4,
    name: "Milo",
    breed: "Orange Cat",
    age: "6 Months",
    type: "Cat",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500",
    description: "Cute kitten ready to find a forever home."
  }
];

function App() {

  const [users, setUsers] = useState(
    JSON.parse(localStorage.getItem("users")) || []
  );

  const [pets, setPets] = useState(
    JSON.parse(localStorage.getItem("pets")) || initialPets
  );

  const [applications, setApplications] = useState(
    JSON.parse(localStorage.getItem("applications")) || []
  );

  const [currentUser, setCurrentUser] = useState(null);

  const [isRegister, setIsRegister] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [selectedPet, setSelectedPet] = useState(null);
  const [applicationText, setApplicationText] = useState("");

  const [newPet, setNewPet] = useState({
    name: "",
    breed: "",
    age: "",
    type: "Dog",
    image: "",
    description: ""
  });

  // SAVE PETS

  const updatePets = (data) => {
    setPets(data);
    localStorage.setItem("pets", JSON.stringify(data));
  };

  // SAVE APPLICATIONS

  const updateApplications = (data) => {
    setApplications(data);
    localStorage.setItem("applications", JSON.stringify(data));
  };

  // SIGNUP

  const handleSignup = (e) => {
    e.preventDefault();

    if (users.some((user) => user.email === email)) {
      alert("Email already registered!");
      return;
    }

    const newUser = {
      name,
      email,
      password,
      role: "user"
    };

    const updatedUsers = [...users, newUser];

    setUsers(updatedUsers);

    localStorage.setItem("users", JSON.stringify(updatedUsers));

    alert("Registration successful! Please login.");

    setIsRegister(false);
    setName("");
    setEmail("");
    setPassword("");
  };

  // LOGIN

  const handleLogin = (e) => {
    e.preventDefault();

    if (
      email === "admin@pawhome.com" &&
      password === "admin123"
    ) {
      setCurrentUser({
        name: "Admin",
        email,
        role: "admin"
      });

      return;
    }

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      setCurrentUser(user);
    } else {
      alert("Invalid email or password!");
    }
  };

  // LOGOUT

  const logout = () => {
    setCurrentUser(null);
    setEmail("");
    setPassword("");
    setSelectedPet(null);
    setApplicationText("");
  };

  // OPEN APPLICATION FORM

  const openApplication = (pet) => {

    const alreadyApplied = applications.some(
      (app) =>
        app.petId === pet.id &&
        app.email === currentUser.email
    );

    if (alreadyApplied) {
      alert("You have already applied for this pet!");
      return;
    }

    setSelectedPet(pet);
    setApplicationText("");
  };

  // SUBMIT WRITTEN APPLICATION

  const submitApplication = (e) => {
    e.preventDefault();

    if (applicationText.trim() === "") {
      alert("Please write your adoption application.");
      return;
    }

    const application = {
      id: Date.now(),
      petId: selectedPet.id,
      petName: selectedPet.name,
      userName: currentUser.name,
      email: currentUser.email,
      message: applicationText,
      status: "Pending"
    };

    const updatedApplications = [
      ...applications,
      application
    ];

    updateApplications(updatedApplications);

    alert("Your adoption application has been sent successfully!");

    setSelectedPet(null);
    setApplicationText("");
  };

  // ADD PET - ADMIN

  const addPet = (e) => {
    e.preventDefault();

    const pet = {
      ...newPet,
      id: Date.now(),
      image:
        newPet.image ||
        "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500"
    };

    updatePets([...pets, pet]);

    setNewPet({
      name: "",
      breed: "",
      age: "",
      type: "Dog",
      image: "",
      description: ""
    });

    alert("Pet added successfully!");
  };

  // DELETE PET - ADMIN

  const deletePet = (id) => {

    if (window.confirm("Are you sure you want to delete this pet?")) {

      updatePets(pets.filter((pet) => pet.id !== id));

    }
  };

  // ACCEPT / REJECT APPLICATION

  const updateStatus = (id, status) => {

    const updated = applications.map((app) =>
      app.id === id
        ? { ...app, status }
        : app
    );

    updateApplications(updated);

    alert("Application status updated!");
  };

  // LOGIN AND SIGNUP PAGE

  if (!currentUser) {

    return (

      <div className="auth-page">

        <div className="auth-box">

          <h1 className="logo">PawHome</h1>

          <p className="tagline">
            Every pet deserves a loving home.
          </p>

          <h2>
            {isRegister ? "Create Account" : "Welcome Back"}
          </h2>

          <form onSubmit={isRegister ? handleSignup : handleLogin}>

            {isRegister && (

              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

            )}

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">
              {isRegister ? "Sign Up" : "Login"}
            </button>

          </form>

          <p>

            {isRegister
              ? "Already have an account?"
              : "Don't have an account?"}

            <span
              className="switch"
              onClick={() => setIsRegister(!isRegister)}
            >

              {isRegister ? " Login" : " Sign Up"}

            </span>

          </p>

        </div>

      </div>

    );
  }

  // ADMIN DASHBOARD

  if (currentUser.role === "admin") {

    return (

      <div className="dashboard">

        <nav className="navbar">

          <h2>PawHome Admin</h2>

          <button onClick={logout}>Logout</button>

        </nav>

        <div className="container">

          <h1>Admin Dashboard</h1>

          <p>Welcome, Admin!</p>

          <div className="stats">

            <div className="stat-card">
              <h2>{pets.length}</h2>
              <p>Total Pets</p>
            </div>

            <div className="stat-card">
              <h2>{applications.length}</h2>
              <p>Total Applications</p>
            </div>

            <div className="stat-card">
              <h2>
                {applications.filter(
                  (a) => a.status === "Pending"
                ).length}
              </h2>
              <p>Pending Applications</p>
            </div>

          </div>

          {/* ADD PET */}

          <h2>Add New Pet</h2>

          <form className="pet-form" onSubmit={addPet}>

            <input
              placeholder="Pet Name"
              value={newPet.name}
              onChange={(e) =>
                setNewPet({ ...newPet, name: e.target.value })
              }
              required
            />

            <input
              placeholder="Breed"
              value={newPet.breed}
              onChange={(e) =>
                setNewPet({ ...newPet, breed: e.target.value })
              }
              required
            />

            <input
              placeholder="Age"
              value={newPet.age}
              onChange={(e) =>
                setNewPet({ ...newPet, age: e.target.value })
              }
              required
            />

            <select
              value={newPet.type}
              onChange={(e) =>
                setNewPet({ ...newPet, type: e.target.value })
              }
            >
              <option>Dog</option>
              <option>Cat</option>
              <option>Other</option>
            </select>

            <input
              placeholder="Image URL (Optional)"
              value={newPet.image}
              onChange={(e) =>
                setNewPet({ ...newPet, image: e.target.value })
              }
            />

            <input
              placeholder="Description"
              value={newPet.description}
              onChange={(e) =>
                setNewPet({ ...newPet, description: e.target.value })
              }
            />

            <button type="submit">Add Pet</button>

          </form>

          {/* MANAGE PETS */}

          <h2>Manage Pets</h2>

          <div className="pet-grid">

            {pets.map((pet) => (

              <div className="pet-card" key={pet.id}>

                <img src={pet.image} alt={pet.name} />

                <h3>{pet.name}</h3>

                <p>{pet.breed}</p>

                <p>{pet.age}</p>

                <button
                  className="delete-btn"
                  onClick={() => deletePet(pet.id)}
                >
                  Delete Pet
                </button>

              </div>

            ))}

          </div>

          {/* VIEW APPLICATIONS */}

          <h2>Received Adoption Applications</h2>

          {applications.length === 0 ? (

            <p>No applications received yet.</p>

          ) : (

            <div className="application-list">

              {applications.map((app) => (

                <div className="application-card" key={app.id}>

                  <h3>{app.petName}</h3>

                  <p><b>Applicant:</b> {app.userName}</p>

                  <p><b>Email:</b> {app.email}</p>

                  <h4>Adoption Application:</h4>

                  <p className="application-message">
                    {app.message}
                  </p>

                  <p>
                    <b>Status:</b> {app.status}
                  </p>

                  {app.status === "Pending" && (

                    <>

                      <button
                        onClick={() =>
                          updateStatus(app.id, "Accepted")
                        }
                      >
                        Accept
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          updateStatus(app.id, "Rejected")
                        }
                      >
                        Reject
                      </button>

                    </>

                  )}

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    );
  }

  // USER DASHBOARD

  return (

    <div className="dashboard">

      <nav className="navbar">

        <h2>PawHome</h2>

        <div>

          <span>Welcome, {currentUser.name}</span>

          <button onClick={logout}>Logout</button>

        </div>

      </nav>

      <div className="container">

        <section className="hero">

          <h1>Find Your Perfect Companion</h1>

          <p>
            Give a loving pet a second chance at happiness.
            Adopt, care and make a difference.
          </p>

        </section>

        {/* AVAILABLE PETS */}

        <h2>Available Pets for Adoption</h2>

        <div className="pet-grid">

          {pets.map((pet) => (

            <div className="pet-card" key={pet.id}>

              <img src={pet.image} alt={pet.name} />

              <h3>{pet.name}</h3>

              <p><b>Breed:</b> {pet.breed}</p>

              <p><b>Age:</b> {pet.age}</p>

              <p><b>Type:</b> {pet.type}</p>

              <p>{pet.description}</p>

              <button
                onClick={() => openApplication(pet)}
              >
                Apply for Adoption
              </button>

            </div>

          ))}

        </div>

        {/* WRITTEN APPLICATION FORM */}

        {selectedPet && (

          <div className="application-form-section">

            <h2>Adoption Application</h2>

            <h3>Applying to adopt: {selectedPet.name}</h3>

            <p>
              Please explain why you want to adopt this pet.
            </p>

            <form onSubmit={submitApplication}>

              <textarea
                placeholder="Write your adoption application here..."
                value={applicationText}
                onChange={(e) =>
                  setApplicationText(e.target.value)
                }
                rows="7"
                required
              />

              <button type="submit">
                Submit Application
              </button>

              <button
                type="button"
                className="delete-btn"
                onClick={() => setSelectedPet(null)}
              >
                Cancel
              </button>

            </form>

          </div>

        )}

        {/* USER APPLICATION TRACKING */}

        <h2>My Adoption Applications</h2>

        {applications.filter(
          (app) => app.email === currentUser.email
        ).length === 0 ? (

          <p>You haven't submitted any applications yet.</p>

        ) : (

          <div className="application-list">

            {applications
              .filter(
                (app) => app.email === currentUser.email
              )
              .map((app) => (

                <div className="application-card" key={app.id}>

                  <h3>{app.petName}</h3>

                  <p><b>Applicant:</b> {app.userName}</p>

                  <h4>Your Application:</h4>

                  <p className="application-message">
                    {app.message}
                  </p>

                  <p>
                    <b>Application Status:</b>
                  </p>

                  <span className={`status ${app.status.toLowerCase()}`}>
                    {app.status}
                  </span>

                </div>

              ))}

          </div>

        )}

      </div>

    </div>

  );
}

export default App;