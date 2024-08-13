import data from '../assets/data/versions.json'
import { AiFillEye } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
const Rewind = () => {
    const navigate = useNavigate();
    const handleClick = (item) => {
        let path = item.replace(/ /g, "-");
        navigate(`${path.toLowerCase()}`)
    };
    return (
        <>
            {data.versions.map((version, index) => (
                <div className="project-div" key={index} onClick={() => { handleClick(version.path) }}>
                    <div className="project-img-div">
                        <AiFillEye className='eye' size={50} />
                        <img className='project-img' src={require(`../assets/rewind_thumbnails/${version.thumbnail}`)} alt="" />
                    </div>
                    <h4 className='title'>{version.name}</h4>
                </div>
            ))}
        </>
    )
}

export default Rewind;