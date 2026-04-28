import { fetchJSON, renderProjects } from "../global.js";
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
const projectsHeading = document.querySelector('.projects-title')
projectsHeading.textContent=`${projects.length} Projects`
renderProjects(projects, projectsContainer, 'h2');
