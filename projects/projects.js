import { fetchJSON, renderProjects } from "../global.js";
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
const projectsHeading = document.querySelector('.projects-title')
let selectedIndex = -1;
let filterYear = -1;

function renderPieChart(projectsArray) {
    let svgEl = document.querySelector('#projects-plot');
    svgEl.innerHTML = '';
    let legendEl = document.querySelector('.legend');
    legendEl.innerHTML = '';
    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

    let rolledData = d3.rollups(
        projectsArray,
        (v) => v.length,
        (d) => d.year,
    );

    let data = rolledData.map(([year, count]) => {
        return { value: count, label: year };
    });

    let sliceGenerator = d3.pie().value((d) => d.value);
    let arcData = sliceGenerator(data);
    let colors = d3.scaleOrdinal(d3.schemeTableau10);
    let arcs = arcData.map((d) => arcGenerator(d));

    arcs.forEach((arc, index) => {
        d3.select('svg').append('path').attr('d', arc).attr('fill', colors(index));
    });

    let legend = d3.select('.legend');

    data.forEach((d, idx) => {
        legend
            .append('li')
            .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
            .attr('class', 'legend-item')
            .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
    });
    let svg = d3.select('svg');
    svg.selectAll('path').remove();
    arcs.forEach((arc, i) => {
        svg
            .append('path')
            .attr('d', arc)

            .attr('fill', colors(i))
            .on('click', () => {
                selectedIndex = selectedIndex === i ? -1 : i;

                svg
                    .selectAll('path')
                    .attr('class', (_, idx) => (
                        idx === selectedIndex ? 'selected' : ''
                    ));


                if (selectedIndex != -1) {
                    filterYear = data[selectedIndex].label
                    filterProjects(query, filterYear)
                }
                else {
                    filterProjects(query, filterYear)
                }
            });
    });
    ;


}


projectsHeading.textContent = `${projects.length} Projects`

renderProjects(projects, projectsContainer, 'h2');
renderPieChart(projects)

let query = '';
let searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('input', (event) => {
    // update query value
    query = event.target.value;
    filterProjects(query, filterYear)
});


function filterProjects(q, year) {
    let filteredProjects = projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        if (selectedIndex != -1)
            return values.includes(q.toLowerCase()) && project.year == year;
        else
            return values.includes(q.toLowerCase())
    })
    renderPieChart(filteredProjects)
    renderProjects(filteredProjects, projectsContainer, 'h2')
}
