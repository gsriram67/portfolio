console.log('IT’S ALIVE!');

let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'resume/', title: 'Resume' },
    { url: 'contact/', title: 'Contact' },
    { url: 'meta/', title: 'Meta' },
    { url: 'https://github.com/gsriram67', title: 'GitHub' }
    // add the rest of your pages here
];

let nav = document.createElement('nav');
document.body.prepend(nav);
for (let p of pages) {
    let url = p.url;
    let title = p.title;

    const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
        ? "/"                  // Local server
        : "/portfolio/";         // GitHub Pages repo name

    url = !url.startsWith('http') ? BASE_PATH + url : url;

    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;

    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
    } else if (a.host != location.host) {
        a.target = '_blank';
    }
    nav.append(a);
}

document.body.insertAdjacentHTML(
    'afterbegin',
    `
	<label class="color-scheme">
		Theme:
		<select>
	        <option value="light dark">Default</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
		</select>
	</label>`,
);

function setColorScheme(scheme) {
    document.documentElement.style.setProperty('color-scheme', scheme);
}


let select = document.querySelector("select")

if ('colorScheme' in localStorage) {
    setColorScheme(localStorage.colorScheme);
    select.value = localStorage.colorScheme
}

select?.addEventListener('input', function(event) {
    setColorScheme(event.target.value);
    localStorage.colorScheme = event.target.value;
});


let form = document.querySelector("form")
form?.addEventListener('submit', function(event) {
    event.preventDefault()
    console.log("form submitted");
    let baseUrl = form.action;
    let params = [];
    for (let [name, value] of new FormData(form)) {
        params.push(name + "=" + encodeURIComponent(value));
    }
    let finalUrl = baseUrl + "?" + params.join("&");
    console.log("Navigating to:", finalUrl);
    location.href = finalUrl;
});

export async function fetchJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching or parsing JSON data:", error);

    }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
    if (!(containerElement instanceof Element))
        return
    if (projects == null || projects.length == 0) {
        const article = document.createElement('article');
        article.innerHTML = "<p> Projects are a work-in-progress !</p>";
        return
    }
    // TODO: edge cases
    containerElement.innerHTML = '';
    projects.forEach(project => {
        const article = document.createElement('article');
        article.innerHTML = `
    <${headingLevel}>${project.title}</${headingLevel}>
    <img src="${project.image}" alt="${project.title}">
    <p>${project.description}<br><i class="project-year">c. ${project.year}</i> </p>
`;
        containerElement?.appendChild(article);
    });
}

export async function fetchGitHubData(username) {
    return fetchJSON(`https://api.github.com/users/${username}`);
}
