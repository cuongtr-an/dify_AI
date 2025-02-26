export default class AppConstants {
    static BASE_URL = "http://localhost/v1";
    // icon lấy ở https://fonts.google.com/icons?icon.query=mess&icon.size=24&icon.color=%23e3e3e3
    static API_MODEL_BASE = {
        'name': 'Mặc định',
        'apikey': 'Bearer app-tMD55bdnR0zP2alcE1kr8dfY',
        'icon': 'home',
    };
    static API_MODEL_OPTIONS = [
        {
            'name': 'Công nghệ thông tin',
            'apikey': `Bearer app-yjA2CFcTA6yqZNJ1kybV6PWC`,
            'icon': 'traffic',
        }
        , {
            'name': 'Y tế',
            'apikey': `Bearer app-oEGgAaAQKdQMwLIzXLKqITfQ`,
            'icon': 'medical_services',
        }
    ];
}