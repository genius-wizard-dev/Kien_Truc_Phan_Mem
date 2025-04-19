# 1: Các lệnh Docker Compose phổ biến

| Lệnh | Mô tả |
|------|-------|
| `docker compose version` | Hiển thị phiên bản của Docker Compose đang được cài đặt |
| `docker compose up` | Tạo và khởi động tất cả các container được định nghĩa trong file docker-compose.yml |
| `docker compose up -d` | Tạo và khởi động các container ở chế độ detached (chạy ngầm trong nền) |
| `docker compose ps` | Liệt kê tất cả các container đang chạy của dự án |
| `docker compose down` | Dừng và xóa tất cả các container, networks được tạo bởi lệnh `up` |
| `docker compose restart` | Khởi động lại tất cả các container đang chạy |
| `docker compose logs -f` | Hiển thị logs của tất cả các container và theo dõi liên tục (follow mode) |
| `docker compose build` | Xây dựng hoặc tái xây dựng các image được sử dụng trong compose file |
| `docker compose exec <service_name> <command>` | Chạy một lệnh trong container đang chạy |
| `docker compose down -v` | Dừng và xóa tất cả container, networks và cả volumes |
| `docker compose run <service_name> <command>` | Chạy một lệnh trên container mới của service được chỉ định |
| `docker compose stop <service_name>` | Dừng các container của service được chỉ định mà không xóa chúng |
| `docker compose rm <service_name>` | Xóa các container đã dừng của service được chỉ định |
| `docker compose config` | Kiểm tra và hiển thị cấu hình compose file sau khi xử lý biến môi trường, etc. |
| `docker compose up -d --build` | Khởi động các container ở chế độ detached sau khi build lại các image |

## Hình ảnh minh họa

### Docker Compose Version
![Docker Compose Version](./demo/1.png)

### Docker Compose Up
![Docker Compose Up](./demo/2.png)

### Docker Compose Up
![Docker Compose Up -d](./demo/up-d.png)

### Docker Compose PS
![Docker Compose PS](./demo/3.png)

### Docker Compose Down
![Docker Compose Down](link-hinh-anh-4)

### Docker Compose Restart
![Docker Compose Restart](/demo/5.png)

### Docker Compose Logs -f
![Docker Compose Logs -f](/demo/6.png)

### Docker Compose Build
![Docker Compose Build](/demo/7.png)


### Docker Compose Exec <service_name> <command>
![Docker Compose Build](/demo/8.png)


### Docker Compose Stop
![Docker Compose Stop](/demo/9.png)

### Docker Compose Config
![Docker Compose Config](/demo/10.png)

# 2: Docker Compose file

### Bài 1: Chạy một container đơn giản với Docker Compose
```yaml
name: nginx-simple

services:
    nginx:
        image: nginx:latest
        container_name: nginx_simple
        ports:
            - "8080:80"
```
![](./docker-compose2/b1.png)
### Bài 2: Chạy MySQL với Docker Compose

``` yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: mysql_container
    environment:
      MYSQL_USER: user
      MYSQL_PASSWORD: password
      MYSQL_DATABASE: mydb
      MYSQL_ROOT_PASSWORD: rootpassword
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:

```
![](./docker-compose2/b2.png)

### Bài 3: Kết nối MySQL với PHPMyAdmin

``` yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: mysql_container
    environment:
      MYSQL_USER: user
      MYSQL_PASSWORD: password
      MYSQL_DATABASE: mydb
      MYSQL_ROOT_PASSWORD: rootpassword
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  phpmyadmin:
    image: phpmyadmin/phpmyadmin
    container_name: phpmyadmin_container
    environment:
        PMA_HOST: mysql
        PMA_PORT: 3306
        MYSQL_ROOT_PASSWORD: rootpassword
    ports:
        - "8081:80"
    depends_on:
        - mysql

volumes:
  mysql_data:

```
![](./docker-compose2/b3.png)

### Bài 4: Chạy ứng dụng Node.js với Docker Compose
``` yaml
version: '3.8'

services:
  nodejs:
    image: node:18
    container_name: nodejs_app
    working_dir: /app
    volumes:
      - ./app:/app
    ports:
      - "3056:3056"
    command: bash -c "npm install && npm start"

volumes:
  app:
```
![](./docker-nodejs/image.png)

### Bài 5: Chạy Redis với Docker Compose

``` yaml
services:
  redis:
    image: redis:latest
    container_name: redis_server
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes

volumes:
  redis_data:

```
![](./docker-redis/image.png)
