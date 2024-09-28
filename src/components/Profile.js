import DP from '../assets/dp.png'
import { AiFillInstagram, AiFillMail, AiFillLinkedin, AiFillGithub, AiFillTwitterSquare } from "react-icons/ai";
import { FaCircle } from 'react-icons/fa6';
const Href = (url) => {
    window.open(url, '_blank')
}
// Hello there
const Profile = () => {
    return (
        <div id="profile" className='glass card-outer'>
            <div id="dp-div" className='glass-nofade card-inner'>
                <img src={DP} alt="" id='dp' />
            </div>
            <div id='profile-text'>

                <h3 className='title'>Pratyush Nirwan</h3>
                <h6 className='card-small margin-10px text' id='dd' style={{ margin: '10px' }}>DEVELOPER + DESIGNER</h6>
                <hr />

                <div className='contact-icons'>
                    <div onClick={() => { Href('https://www.instagram.com/pratyush_nirwan') }}>
                        <AiFillInstagram size={25} />
                    </div>
                    <div>
                        <AiFillMail size={25} />
                    </div>
                    <div>
                        <AiFillLinkedin size={25} />
                    </div>
                    <div>
                        <AiFillGithub size={25} />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Profile;