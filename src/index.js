document.addEventListener("DOMContentLoaded", () => {
  const toyCollection = document.getElementById("toy-collection");
  const newToyButton = document.getElementById("new-toy-btn");
  const toyFormContainer = document.getElementById("toy-form-container");
  const toyForm = document.getElementById("toy-form");

  // Toggle form visibility
  newToyButton.addEventListener("click", () => {
    toyFormContainer.style.display = toyFormContainer.style.display === "none" ? "block" : "none";
  });

  // Fetch all toys and render them
  const fetchToys = () => {
    fetch("http://localhost:3000/toys")
      .then(response => response.json())
      .then(toys => {
        toyCollection.innerHTML = ''; // Clear the collection before rendering new toys
        toys.forEach(renderToy);
      });
  };

  // Render a single toy card
  const renderToy = (toy) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const h2 = document.createElement("h2");
    h2.textContent = toy.name;

    const img = document.createElement("img");
    img.src = toy.image;
    img.classList.add("toy-avatar");

    const p = document.createElement("p");
    p.textContent = `${toy.likes} Likes`;

    const likeButton = document.createElement("button");
    likeButton.classList.add("like-btn");
    likeButton.id = toy.id;
    likeButton.textContent = "Like ❤️";
    likeButton.addEventListener("click", () => handleLike(toy.id, p));

    card.appendChild(h2);
    card.appendChild(img);
    card.appendChild(p);
    card.appendChild(likeButton);

    toyCollection.appendChild(card);
  };

  // Handle the "Like" button click
  const handleLike = (toyId, pElement) => {
    fetch(`http://localhost:3000/toys/${toyId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        likes: parseInt(pElement.textContent) + 1,
      }),
    })
      .then(response => response.json())
      .then(updatedToy => {
        pElement.textContent = `${updatedToy.likes} Likes`;
      });
  };

  // Handle the toy form submission
  toyForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const image = document.getElementById("image").value;

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        name: name,
        image: image,
        likes: 0,
      }),
    })
      .then(response => response.json())
      .then(newToy => {
        renderToy(newToy);
        toyForm.reset(); // Clear the form
        toyFormContainer.style.display = "none"; // Hide the form after submission
      });
  });

  // Initial fetch and render toys when the page loads
  fetchToys();
});
