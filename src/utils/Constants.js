export default class AppConstants {
    static BASE_URL = "http://localhost/v1";
    // icon lấy ở https://fonts.google.com/icons?icon.query=mess&icon.size=24&icon.color=%23e3e3e3
    static API_MODEL_BASE = {
        'name': 'Mặc định',
        'apikey': 'Bearer app-nnE4FeWy51B5ZVxxW7faj62V',
        'icon': 'home',
    };
    static API_MODEL_OPTIONS = [
        {
            'name': 'Công nghệ thông tin',
            'apikey': `Bearer app-yehCA5OUn9gfVp0sgN4swYUf`,
            'icon': 'code',
        }
        , {
            'name': 'Y tế',
            'apikey': `Bearer app-IOylAbGYJDdPqrlVxUjR6qMQ`,
            'icon': 'medical_services',
        }
    ];
}