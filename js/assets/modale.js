import { BASE_API_URL } from "./variables.js";
import { getWorksAndReturn } from "./api.js";
import { getToken } from "../pages/ifLogged.js";

const workSectionEl = document.getElementById("api-works");
const modalAside = document.getElementById("modal-1");

export async function showModal1() {
	const tokenFound = await getToken();
	if (tokenFound) {
		const modalOnClick = document.getElementById("modifyProjects");
		modalOnClick.addEventListener("click", () => {
			if (modalAside) {
				modalAside.setAttribute("aria-hidden", "false");
				modalAside.setAttribute("aria-modal", "true");
				modalAside.classList.remove("modalInvisible");
				modalAside.classList.add("modalVisible");
			}
		});
	} else {
		console.log("user is not logged in");
	}
}

async function fetchAndDisplayWorksInModal() {
	workSectionEl.innerHTML = "";
	const works = await getWorksAndReturn();
	for (const work of works) {
		const figure = document.createElement("figure");
		figure.classList.add("modal-work");
		figure.setAttribute("id", `work-${work.id}`);
		const img = document.createElement("img");
		img.src = work.imageUrl;
		img.alt = work.title;
		const deleteIconDiv = document.createElement("div");
		deleteIconDiv.setAttribute("id", "delete-icon-div");
		const deleteIcon = document.createElement("img");
		deleteIcon.setAttribute("id", `icon-${work.id}`);
		deleteIcon.src = "assets/icons/delete.png";
		deleteIcon.alt = "delete icon";
		deleteIcon.classList.add("delete-icon");

		deleteIconDiv.appendChild(deleteIcon);
		figure.appendChild(deleteIconDiv);
		figure.appendChild(img);
		workSectionEl.appendChild(figure);
	}
}

async function integrateAddWorkButton() {
	const buttonAddWorkDiv = document.createElement("div");
	buttonAddWorkDiv.setAttribute("id", "button-add-work-div");

	const buttonAddWork = document.createElement("button");
	buttonAddWork.setAttribute("id", "add-new-work");
	buttonAddWork.setAttribute("type", "button");
	buttonAddWork.textContent = "Ajouter une photo";

	const dividerEl = document.createElement("hr");
	dividerEl.classList.add("divider-modal");

	buttonAddWorkDiv.appendChild(dividerEl);
	buttonAddWorkDiv.appendChild(buttonAddWork);
	workSectionEl.insertAdjacentElement("afterend", buttonAddWorkDiv);
}

export async function displayFirstModalContent() {
	fetchAndDisplayWorksInModal();
	integrateAddWorkButton();
}

export async function deleteWork() {
	const tokenFound = await getToken();
	if (!tokenFound) return;
	const works = await getWorksAndReturn();
	works.forEach((work) => {
		const deleteIcon = document.getElementById(`icon-${work.id}`);
		if (deleteIcon) {
			deleteIcon.addEventListener("click", () => {
				console.log(deleteIcon);

				const url = `${BASE_API_URL}works/${work.id}`;
				const options = {
					method: "DELETE",
					headers: {
						/* prettier-ignore */
						"Authorization": `Bearer-${tokenFound}`,
						"Content-Type": "application/json",
					},
				};
				fetch(url, options)
					.then((response) => {
						if (!response.ok) {
							throw new Error("Network response was not ok");
						}
						console.log("Resource deleted successfully");
						const deletedWork = document.getElementById(`work-${work.id}`);
						deletedWork.remove();
						fetchAndDisplayWorksInModal();
						fetchAndDisplayWorks();
					})
					.catch((error) => {
						console.error(
							"There was a problem with the DELETE request:",
							error.message
						);
					});
			});
		} else {
			console.error(`Element with ID icon-${work.id} not found`);
		}
	});
}

export async function closeModal() {
	const closeModalButton = document.getElementById("js-modal-close");
	if (closeModalButton) {
		closeModalButton.addEventListener("click", () => {
			if (modalAside) {
				modalAside.classList.remove("modalVisible");
				modalAside.classList.add("modalInvisible");
				modalAside.setAttribute("aria-hidden", "true");
				modalAside.setAttribute("aria-modal", "false");
			}
		});
	}
}
