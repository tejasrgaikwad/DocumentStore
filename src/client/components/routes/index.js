import App from '../App';
import PackageDetails from '../PackageDetails';

export default  [

    {
        component: App,
        path: "/",
        exact: true
    },
    {
        component: PackageDetails,
        path: "/package-details",
        exact: true
    }
    
]