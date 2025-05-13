import projects from '../assets/Database/Projects.json';

export default function ProjectTree() {
    return (
        <div className="project-display">
            {projects.map((project, i) => {
                const isLast = i === projects.length - 1;
                const prefix = isLast ? '└─' : '├─';
                const childPrefix = isLast ? '   ' : '│  ';
                const { demo, github } = project.links || {};

                return (
                    <div key={project.name} className="project-block">
                        <div>
                            {prefix} <span className="project-blog-name">{project.name}</span>
                        </div>
                        <div>
                            {childPrefix}<span className="features">├─ Overview: {project.overview}</span>
                        </div>
                        <div>
                            {childPrefix}<span className="features">├─ Tech: {project.tech_stack}</span>
                        </div>
                        <div>
                            {childPrefix}<span className="features">└─ Links:</span>{' '}
                            {demo && (
                                <a href={demo} target="_blank" rel="noopener noreferrer">
                                    Demo
                                </a>
                            )}
                            {demo && github && ' | '}
                            {github && (
                                <a href={github} target="_blank" rel="noopener noreferrer">
                                    GitHub
                                </a>
                            )}
                        </div>
                        {i !== projects.length - 1 && <div className="divider">│</div>}
                    </div>
                );
            })}
        </div>
    );
}
