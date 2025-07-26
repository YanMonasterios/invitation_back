import { Server } from "./presentation/server";
import { envs } from "./config/envs"; 


(async() => {
    main();

})();

function main() {

    const server = new Server({
        port: envs.port,
        public_path: envs.PUBLIC_PATH
    });

    server.start();
    // console.log('main')

}

