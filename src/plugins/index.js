import wyDome from './components/wyDome';
import wyCalendar from './components/wyCalendar';
import './fonts/iconfont.css';

const components = {
    wyDome,
    wyCalendar
}

const install = (Vue, opts = {}) => {

    Object.keys(components).forEach(key => {
        console.log(key);
        Vue.component(key, components[key]);
    });

}

const API = {
    install,
    ...components
}


export default API;
