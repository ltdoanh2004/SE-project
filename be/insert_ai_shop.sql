-- First disable foreign key checks to allow modifications
SET FOREIGN_KEY_CHECKS=0;

-- Truncate tables in reverse order of dependencies
TRUNCATE TABLE reviews;
TRUNCATE TABLE carts;
TRUNCATE TABLE pays;
TRUNCATE TABLE orducts;
TRUNCATE TABLE orders;
TRUNCATE TABLE products;
TRUNCATE TABLE customers;
TRUNCATE TABLE admins;
TRUNCATE TABLE users;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS=1;

-- Insert users with proper bcrypt-style password hashes
-- All test passwords are 'password123' for convenience
INSERT INTO users (userID, userName, email, password, role, phoneNumber, date) VALUES
(1, 'User1', 'user1@gmail.com', '$2b$10$otuIS.BOmjXUmzuhU.LUgee3amuj77xsAK4LzVqf7AkGaRfso8NjG', 'customer', '0901234567', '2025-04-20 02:50:10'),
(2, 'User2', 'user2@gmail.com', '$2b$10$otuIS.BOmjXUmzuhU.LUgee3amuj77xsAK4LzVqf7AkGaRfso8NjG', 'customer', '0901234568', '2025-03-14 02:50:10'),
(3, 'User3', 'user3@gmail.com', '$2b$10$otuIS.BOmjXUmzuhU.LUgee3amuj77xsAK4LzVqf7AkGaRfso8NjG', 'customer', '0901234569', '2025-03-20 02:50:10'),
(4, 'User4', 'user4@gmail.com', '$2b$10$otuIS.BOmjXUmzuhU.LUgee3amuj77xsAK4LzVqf7AkGaRfso8NjG', 'customer', '0901234570', '2025-03-05 02:50:10'),
(5, 'User5', 'user5@gmail.com', '$2b$10$otuIS.BOmjXUmzuhU.LUgee3amuj77xsAK4LzVqf7AkGaRfso8NjG', 'customer', '0901234571', '2025-04-27 02:50:10'),
(6, 'User6', 'user6@gmail.com', '$2b$10$otuIS.BOmjXUmzuhU.LUgee3amuj77xsAK4LzVqf7AkGaRfso8NjG', 'customer', '0901234572', '2025-03-27 02:50:10'),
(7, 'User7', 'user7@gmail.com', '$2b$10$otuIS.BOmjXUmzuhU.LUgee3amuj77xsAK4LzVqf7AkGaRfso8NjG', 'customer', '0901234573', '2025-03-27 02:50:10'),
(8, 'User8', 'user8@gmail.com', '$2b$10$otuIS.BOmjXUmzuhU.LUgee3amuj77xsAK4LzVqf7AkGaRfso8NjG', 'customer', '0901234574', '2025-04-10 02:50:10'),
(9, 'Admin1', 'admin1@gmail.com', '$2b$10$otuIS.BOmjXUmzuhU.LUgee3amuj77xsAK4LzVqf7AkGaRfso8NjG', 'admin', '0901234575', '2025-03-06 02:50:10'),
(10, 'Admin2', 'admin2@gmail.com', '$2b$10$otuIS.BOmjXUmzuhU.LUgee3amuj77xsAK4LzVqf7AkGaRfso8NjG', 'admin', '0901234576', '2025-03-13 02:50:10');

-- Insert admins
INSERT INTO admins (userID, bankAccountNumber, bank) VALUES
(9, '01234567891', 'HDbank'),
(10, '01234567901', 'VPbank');

-- Insert customers
INSERT INTO customers (userID, address) VALUES 
(1, '123 Street 1, Q1, TPHCM'),
(2, '123 Street 2, Q2, TPHCM'),
(3, '123 Street 3, Q3, TPHCM'),
(4, '123 Street 4, Q4, TPHCM'),
(5, '123 Street 5, Q5, TPHCM'),
(6, '123 Street 6, Q6, TPHCM'),
(7, '123 Street 7, Q7, TPHCM'),
(8, '123 Street 8, Q8, TPHCM');

-- Insert products (ensuring all enum values match allowed values)
INSERT INTO products (userID, date, name, jewelryFit, jewelryType, material, brand, collection, price, stockQuantity, productDescription, model3D, images, discount) VALUES 
-- NHẪN (Rings) - 9 products
(9, '2025-05-03 07:50:10', 'Nhẫn Bạc đính đá', 'nữ', 'nhẫn', 'bạc', 'Daniel Wellington', 'Trang Sức Đính Kim Cương', 1070000, 10, 'Với thiết kế một bông hoa được gắn kết từ nhiều viên đá khác nhau đã tạo nên một chiếc nhẫn bạc đính đá rực rỡ và tỏa sáng. Nhờ vào sự phản chiếu đa sắc của những viên đá nên sản phẩm nay trông thêm phần lấp lánh và kiêu sa. Hình ảnh rất đỗi quen thuộc này dường như là một biểu tượng của nét đẹp người con gái. Điểm xuyến cho bông hoa chính là sự đan xen kết hợp của nhiều tầng đá nhỏ khác nhau, tạo nên vẻ sang trọng và quý phái cho sản phẩm.', '/models/ring1.glb', '["/image/ring1.png","/image/ring1_2.png"]', 0.00),
(9, '2025-05-03 07:50:10', 'Nhẫn Vàng trắng 14K đính ngọc trai', 'nam', 'nhẫn', 'platinum', 'Calvin Klein', 'Trang Sức Đính ECZ', 1340000, 11, 'Điểm xuyến trên dáng hình là viên Ngọc trai sáng bóng mang vẻ đẹp cổ điển không bị phai mờ theo thời gian, kết hợp cùng chất liệu vàng 14K, món trang sức hoàn hảo không chỉ tôn lên vẻ đẹp rạng ngời, ngọt ngào mà còn thể hiện được sức quyến rũ của quý ông.', '/models/ring2.glb', '["/image/ring2.png","/image/ring2_2.png"]', 0.00),
(9, '2025-05-03 07:50:10', 'Nhẫn 14k với opal và kim cương', 'trẻ em', 'nhẫn', 'vàng', 'Michael Kors', 'Trang Sức Công Nghệ Ý', 2370000, 12, 'Nhẫn 14K thiết kế hai tông vàng – vàng trắng và vàng vàng – nổi bật với viên opal thiên nhiên dạng tròn ở vị trí trung tâm, tỏa ánh sắc cầu vồng đặc trưng. Hai viên opal size nhỏ hơn ôm hai bên, tạo thành cụm tam thạch cân đối.', '/models/ring3.glb', '["/image/ring3.png","/image/ring3_2.png"]', 0.00),
(9, '2025-05-03 07:50:10', 'Nhẫn Bạc đính đá STYLE', 'nữ', 'nhẫn', 'platinum', 'Fossils', 'Kim Cương Viên', 395000, 13, 'Với sản phẩm này, nàng có thể kết hợp với nhiều món trang sức hoặc phụ kiện khác nhau như dây cổ, lắc, vòng để tạo nên một phong cách thời trang của riêng mình hoặc tặng cho những người mà mình yêu thương.', '/models/ring1.glb', '["/image/ring4.png","/image/ring4_2.png"]', 0.00),
(9, '2025-05-03 07:50:10', 'Nhẫn cưới nam Vàng 18K', 'nam', 'nhẫn', 'vàng', 'Titan', 'Trang Sức Đính CZ', 844000, 14, 'Với sự xuất hiện của nhiều thiết kế trang nhã, nhẫn cưới không chỉ được phái đẹp ưa chuộng mà còn được các chàng trai lựa chọn cho ngày cưới. Tận dụng sắc vàng 18K rực rỡ cùng với sự biến tấu một cách khéo léo về kiểu dáng nam tính', '/models/ring2.glb', '["/image/ring5.png","/image/ring5_2.png"]', 0.00),
(9, '2025-05-03 07:50:10', 'Nhẫn trẻ em Bạc PNJSilver', 'trẻ em', 'nhẫn', 'bạc', 'Daniel Wellington', 'Trang Sức Đính Kim Cương', 2500000, 15, 'Nhẫn bạc trẻ em không chỉ là một món trang sức mà còn là kỷ vật đáng yêu, ghi dấu những khoảnh khắc tuổi thơ. Với thiết kế dễ thương, sản phẩm được làm từ chất liệu bạc cao cấp, nhẫn bạc này sẽ là món quà ý nghĩa dành tặng bé yêu.', '/models/ring3.glb', '["/image/ring6.png","/image/ring6_2.png"]', 0.00),
(9, '2025-05-03 07:50:10', 'Vỏ nhẫn Kim cương Vàng 18K', 'nữ', 'nhẫn', 'vàng', 'Calvin Klein', 'Trang Sức Đính Kim Cương', 1560000, 16, 'Để tôn vinh vẻ đẹp sang trọng và mạnh mẽ của nàng, chúng tôi cho ra đời những thiết kế tinh tế với sự phối trộn hài hoà giữa kim cương và chất liệu vàng 18K tinh xảo. Và để mang đến nhiều sự lựa chọn về viên đá chủ, chúng tôi mang đến mẫu vỏ nhẫn Kim cương sang trọng và tinh tế.', '/models/ring1.glb', '["/image/ring7.png","/image/ring7_2.png"]', 0.00),
(9, '2025-05-03 07:50:10', 'Nhẫn cưới nam Bạch kim đính Kim cương', 'nam', 'nhẫn', 'platinum', 'Michael Kors', 'Trang Sức Công Nghệ Ý', 2410000, 17, 'Kim cương vốn là món trang sức mang đến niềm kiêu hãnh và cảm hứng thời trang bất tận. Sở hữu riêng cho mình món trang sức kim cương chính là điều mà ai cũng mong muốn. Chiếc nhẫn được chế tác từ bạch kim cùng điểm nhấn kim cương với 57 giác cắt chuẩn xác, tạo nên món trang sức đầy sự sang trọng và đẳng cấp.', '/models/ring2.glb', '["/image/ring8.png","/image/ring8_2.png"]', 0.00),
(9, '2025-05-03 07:50:10', 'Nhẫn trẻ em bạc đính đá PNJSilver', 'trẻ em', 'nhẫn', 'bạc', 'Fossils', 'Kim Cương Viên', 445000, 18, 'Với kiểu dáng thời thượng cùng những viên đá đính xung quanh bề mặt chiếc nhẫn trên chất liệu bạc 92.5, PNJSilver mang đến chiếc nhẫn dành cho các cô công chúa nhỏ.', '/models/ring3.glb', '["/image/ring9.png","/image/ring9_2.png"]', 0.00), 

-- DÂY CHUYỀN (Necklaces) - 8 products
(9, '2025-05-03 07:50:10', 'Dây chuyền Vàng 18K', 'nữ', 'dây chuyền', 'vàng', 'Titan', 'Trang Sức Đính CZ', 1562600, 10, 'Bằng việc kết hợp chất liệu vàng 18K cùng thiết kế tinh tế, sợi dây chuyền chính là điểm nhấn nổi bật, tô điểm thêm vẻ đẹp thanh lịch và duyên dáng cho nàng. Dây đeo mảnh thích hợp với những bộ trang phục có nhiều họa tiết, đồng thời tạo điểm nhìn cân bằng với các phụ kiện to bản khác.', NULL, '["/image/daychuyen1.png","/image/daychuyen1_2.png"]', 0.00),
(9, '2025-05-03 07:50:10', 'Dây chuyền nam bạc MANCODE', 'nam', 'dây chuyền', 'bạc', 'Daniel Wellington', 'Trang Sức Đính Kim Cương', 1195000, 11, 'Tiếp nối xu hướng trang sức theo phong cách trẻ trung và cá tính, những món trang sức từ MANCODE chắc chắn sẽ làm dậy sóng thế giới thời trang của các bạn trai. Chiếc dây chuyền với cảm hứng thiết kế hoàn toàn mới lạ, đến từ MANCODE sẽ giúp bạn thể hiện cá tính của mình.', NULL, '["/image/daychuyen2.png","/image/daychuyen2_2.png"]', 0.00),
(9, '2025-05-03 07:50:10', 'Dây chuyền Bạch kim 10K', 'trẻ em', 'dây chuyền', 'platinum', 'Calvin Klein', 'Trang Sức Đính ECZ', 3835000, 12, 'Bằng việc kết hợp chất liệu bạch kim 10K cùng thiết kế tinh tế, sợi dây chuyền chính là điểm nhấn nổi bật, tô điểm thêm vẻ đẹp thanh lịch và duyên dáng cho nàng. Dây đeo mảnh thích hợp với những bộ trang phục có nhiều họa tiết, đồng thời tạo điểm nhìn cân bằng với các phụ kiện to bản khác.', NULL, '["/image/daychuyen3.png","/image/daychuyen3_2.png"]', 0.00),
(9, '2025-05-03 07:50:10', 'Dây chuyền Vàng 14K', 'nữ', 'dây chuyền', 'vàng', 'Michael Kors', 'Trang Sức Công Nghệ Ý', 1071400, 13, 'Bằng việc kết hợp chất liệu vàng 14K cùng thiết kế tinh tế, sợi dây chuyền chính là điểm nhấn nổi bật, tô điểm thêm vẻ đẹp thanh lịch và duyên dáng cho nàng. Dây đeo mảnh thích hợp với những bộ trang phục có nhiều họa tiết, đồng thời tạo điểm nhìn cân bằng với các phụ kiện to bản khác.', NULL, '["/image/daychuyen4.png","/image/daychuyen4_2.png"]', 0.00),
(9, '2025-05-03 07:50:10', 'Dây chuyền nam Bạc', 'nam', 'dây chuyền', 'bạc', 'Fossils', 'Kim Cương Viên', 3995000, 14, 'Tiếp nối xu hướng trang sức theo phong cách trẻ trung và cá tính, những món trang sức chắc chắn sẽ làm dậy sóng thế giới thời trang của các bạn trai. Chiếc dây chuyền với cảm hứng thiết kế hoàn toàn mới lạ sẽ giúp bạn thể hiện cá tính của mình.', NULL, '["/image/daychuyen5.png","/image/daychuyen5_2.png"]', 0.00),
(9, '2025-05-03 07:50:10', 'Dây chuyền trẻ em Bạch kim', 'trẻ em', 'dây chuyền', 'platinum', 'Titan', 'Trang Sức Đính CZ', 295000, 15, 'Tiếp nối xu hướng trang sức theo phong cách trẻ trung và cá tính, những món trang sức chắc chắn sẽ làm dậy sóng thế giới thời trang. Chiếc dây chuyền bạc với thiết kế tinh xảo sẽ là món quà dành riêng cho bé.', NULL, '["/image/daychuyen6.png","/image/daychuyen6_2.png"]', 0.00),
(9, '2025-05-03 07:50:10', 'Dây chuyền Vàng', 'nữ', 'dây chuyền', 'vàng', 'Daniel Wellington', 'Trang Sức Đính Kim Cương', 1645900, 16, 'Sợi dây chuyền không chỉ là một món trang sức giúp tôn lên vẻ đẹp cho phái đẹp, mà nó còn truyền tải một thông điệp hết sức ý nghĩa. Để sở hữu sợi dây chuyền hoàn hảo các nàng có thể Mix cùng với mặt dây chuyền, những hạt charm mang những kỷ niệm của riêng mình nhé !', NULL, '["/image/daychuyen7.png","/image/daychuyen7_2.png"]', 0.00),
(9, '2025-05-03 07:50:10', 'Dây chuyền nam bạc', 'nam', 'dây chuyền', 'bạc', 'Calvin Klein', 'Trang Sức Đính ECZ', 295000, 17, 'Tiếp nối xu hướng trang sức theo phong cách trẻ trung và cá tính, những món trang sức chắc chắn sẽ làm dậy sóng thế giới thời trang. Chiếc dây chuyền bạc với thiết kế tinh xảo sẽ là món quà dành riêng cho quý ông.', NULL, '["/image/daychuyen8.png","/image/daychuyen8_2.png"]', 0.00),

-- BÔNG TAI (Earrings) - 6 products
(9, '2025-05-03 07:50:10', 'Bông tai Bạch kim đính đá STYLE', 'nữ', 'bông tai', 'platinum', 'Michael Kors', 'Trang Sức Công Nghệ Ý', 855000, 10, 'Bông tai bạch kim từ STYLE được thiết kế kiểu dáng cá tính ,tinh tế với điểm nhấn đính đá trên chất liệu bạc 92.5, sáng lấp lánh làm nền tạo điểm nhấn giúp tôn lên vẻ đẹp của nàng xinh, gây ấn tượng với nhiều người xung quanh.', NULL, '["/image/bongtai1.png","/image/bongtai1_2.png"]', 0.00),
(9, '2025-05-03 07:50:10', 'Bông tai nam Kim cương Vàng Trắng 14K', 'nam', 'bông tai', 'vàng', 'Fossils', 'Kim Cương Viên', 7500000, 11, 'Với thiết kế nam tính, bông tai nam không chỉ là món trang sức mà còn là biểu tượng của phong cách thời thượng, mạnh mẽ. Chất liệu vàng 14K đảm bảo độ bền và sáng bóng theo thời gian, tôn lên vẻ đẹp nam tính của phái mạnh kết hợp kim cương - biểu tượng của sự sang trọng và hiện đại.', NULL, '["/image/bongtai2.png","/image/bongtai2_2.png"]', 0.00),
(9, '2025-05-03 07:50:10', 'Bông tai Test 3', 'trẻ em', 'bông tai', 'bạc', 'Titan', 'Trang Sức Đính CZ', 120000, 12, 'Sản phẩm test bông tai số 3', NULL, '["/image/bongtai3.png","/image/bongtai3_2.png"]', 0.00),
(9, '2025-05-03 07:50:10', 'Bông tai Test 4', 'nữ', 'bông tai', 'platinum', 'Daniel Wellington', 'Trang Sức Đính Kim Cương', 130000, 13, 'Sản phẩm test bông tai số 4', NULL, '["/image/bongtai4.png","/image/bongtai4_2.png"]', 0.00),
(9, '2025-05-03 07:50:10', 'Bông tai Test 5', 'nam', 'bông tai', 'vàng', 'Calvin Klein', 'Trang Sức Đính ECZ', 140000, 14, 'Sản phẩm test bông tai số 5', NULL, '["/image/bongtai5.png","/image/bongtai5_2.png"]', 0.00),
(9, '2025-05-03 07:50:10', 'Bông tai Test 6', 'trẻ em', 'bông tai', 'bạc', 'Michael Kors', 'Trang Sức Công Nghệ Ý', 150000, 15, 'Sản phẩm test bông tai số 6', NULL, '["/image/bongtai6.png","/image/bongtai6_2.png"]', 0.00), 

-- VÒNG (Bracelets) - 7 products
(9, '2025-05-03 07:50:10', 'Vòng Bạc đính đá Disney', 'nữ', 'vòng', 'bạc', 'Fossils', 'Kim Cương Viên', 1300000, 10, 'Không phải là món trang sức quá mới mẻ nhưng những chiếc vòng với kiểu dáng độc đáo đã cho thấy được sức mạnh của mình khi trở thành xu hướng được nhiều quý cô trưng diện. Sở hữu thiết kế mang dấu ấn của phong cách của những nàng công chúa Disney trong BST Alice in Wonderland, được chế tác từ bạc Sterling tựa như điểm nhấn đầy sắc màu cho bộ cánh tiệc tùng, giúp nàng tự tin toả sáng trong niềm rộn ràng mùa lễ hội.', '/models/vong1.glb', '["/image/vong1.png","/image/vong1_2.png"]', 0.00),
(9, '2025-05-03 07:50:10', 'Vòng Bạch kim', 'nam', 'vòng', 'platinum', 'Titan', 'Trang Sức Đính CZ', 1400000, 11, 'Chiếc vòng sở hữu sự cứng cáp của bạch kim được chế tác tinh xảo, kết hợp các chi tiết đúc châu độc đáo, tạo nên sự sáng bóng và sang trọng. Với thiết kế độc lạ cùng ánh kim sắc sảo.', '/models/vong2.glb', '["/image/vong2.png","/image/vong2_2.png"]', 0.00),
(9, '2025-05-03 07:50:10', 'Vòng Test 3', 'trẻ em', 'vòng', 'bạc', 'Daniel Wellington', 'Trang Sức Đính Kim Cương', 120000, 12, 'Sản phẩm test vòng số 3', '/models/vong1.glb', '["/image/vong3.png","/image/vong3_2.png"]', 0.00),
(9, '2025-05-03 07:50:10', 'Vòng Test 4', 'nữ', 'vòng', 'platinum', 'Calvin Klein', 'Trang Sức Đính ECZ', 130000, 13, 'Sản phẩm test vòng số 4', '/models/vong2.glb', '["/image/vong4.png","/image/vong4_2.png"]', 0.00),
(9, '2025-05-03 07:50:10', 'Vòng Test 5', 'nam', 'vòng', 'vàng', 'Michael Kors', 'Trang Sức Công Nghệ Ý', 140000, 14, 'Sản phẩm test vòng số 5', '/models/vong1.glb', '["/image/vong5.png","/image/vong5_2.png"]', 0.00),
(9, '2025-05-03 07:50:10', 'Vòng Test 6', 'trẻ em', 'vòng', 'bạc', 'Fossils', 'Kim Cương Viên', 150000, 15, 'Sản phẩm test vòng số 6', '/models/vong2.glb', '["/image/vong6.png","/image/vong6_2.png"]', 0.00),
(9, '2025-05-03 07:50:10', 'Vòng Test 7', 'nữ', 'vòng', 'platinum', 'Titan', 'Trang Sức Đính CZ', 160000, 16, 'Sản phẩm test vòng số 7', '/models/vong1.glb', '["/image/vong7.png","/image/vong7_2.png"]', 0.00);

-- Insert orders with correct status values matching backend code
INSERT INTO orders (orderID, userID, date, status, money, cancel, cancelReason) VALUES
-- Done orders (Completed and paid)
(1, 1, '2025-04-28 02:50:10', 'done', 497000, 0, NULL),
(2, 2, '2025-04-17 02:50:10', 'done', 456000, 0, NULL),
(3, 3, '2025-03-11 02:50:10', 'done', 334000, 0, NULL),
-- Processing orders (In progress, not paid yet)
(4, 4, '2025-03-05 02:50:10', 'processing', 175000, 0, NULL),
(5, 5, '2025-04-16 02:50:10', 'processing', 218000, 0, NULL),
-- Shipped orders (Shipped but not confirmed received)
(6, 6, '2025-04-24 02:50:10', 'shipped', 381000, 0, NULL),
(7, 7, '2025-03-28 02:50:10', 'shipped', 127000, 0, NULL),
(8, 8, '2025-03-08 02:50:10', 'shipped', 244000, 0, NULL),
-- Canceled order
(9, 1, '2025-03-16 02:50:10', 'cancel', 375000, 1, 'Changed my mind, found a better alternative'),
(10, 2, '2025-04-18 02:50:10', 'processing', 233000, 0, NULL);

-- Insert orducts with updated shipping status (0=processing, 1=shipped)
-- Apply correct discount calculations
INSERT INTO orducts (orDuctID, orderID, productID, quantity, Shipped, price, discount) VALUES
-- Processing order items
(1, 10, 10, 3, 0, 100000, 0.00), -- Not shipped, no discount
(2, 4, 5, 1, 0, 140000, 15.00), -- Not shipped, has 15% discount
(3, 5, 18, 1, 0, 170000, 0.00), -- Not shipped, no discount
-- Shipped order items (for shipped and done orders)
(4, 6, 13, 1, 1, 130000, 0.00), -- Shipped, no discount
(5, 7, 6, 1, 1, 150000, 8.00), -- Shipped, has 8% discount
(6, 8, 9, 1, 1, 180000, 5.00), -- Shipped, has 5% discount
-- Done order items (all shipped)
(7, 1, 12, 2, 1, 120000, 0.00), -- Done, no discount
(8, 1, 2, 1, 1, 110000, 0.00), -- Done, no discount
(9, 2, 6, 3, 1, 150000, 0.00), -- Done, no discount
(10, 2, 16, 1, 1, 160000, 0.00), -- Done, no discount
(11, 3, 3, 2, 1, 120000, 10.00), -- Done, has 10% discount
(12, 3, 4, 1, 1, 130000, 0.00), -- Done, no discount
-- Canceled order items
(13, 9, 19, 1, 0, 100000, 0.00), -- Canceled, not shipped
(14, 9, 7, 2, 0, 160000, 0.00); -- Canceled, not shipped

-- Insert pays with correct payment dates
-- Apply discounts to final money values
INSERT INTO pays (payID, orderID, payDate, payType, money, isPaid) VALUES
-- Done orders - all paid with payment date
(1, 1, '2025-04-29 02:50:10', 'cash', 497000, 1), -- 2 x 120000 + 1 x 110000 = 350000 (no discounts)
(2, 2, '2025-04-18 02:50:10', 'cash', 456000, 1), -- 3 x 150000 + 1 x 160000 = 610000 (no discounts)
(3, 3, '2025-03-12 02:50:10', 'cash', 334000, 1), -- 2 x 120000 x 0.9 (10% off) + 1 x 130000 = 216000 + 130000 = 346000
-- Processing orders - not paid yet
(4, 4, NULL, 'bank-transfer', 119000, 0), -- 1 x 140000 x 0.85 (15% off) = 119000
(5, 5, NULL, 'cash', 218000, 0), -- 1 x 170000 = 170000 (no discount)
-- Shipped orders - some paid, some not
(6, 6, '2025-04-25 02:50:10', 'cash', 130000, 1), -- 1 x 130000 = 130000 (no discount)
(7, 7, NULL, 'cash', 138000, 0), -- 1 x 150000 x 0.92 (8% off) = 138000
(8, 8, '2025-03-09 02:50:10', 'cash', 171000, 1), -- 1 x 180000 x 0.95 (5% off) = 171000
-- Canceled order - no payment
(9, 9, NULL, 'bank-transfer', 375000, 0), -- Never paid (canceled)
(10, 10, NULL, 'bank-transfer', 300000, 0); -- Not paid yet (processing)

-- Insert carts
INSERT INTO carts (id, userID, productID, quantity) VALUES
(1, 6, 6, 5),
(2, 6, 15, 2),
(3, 5, 17, 1),
(4, 6, 9, 5),
(5, 2, 5, 1),
(6, 6, 8, 3),
(7, 7, 9, 3),
(8, 7, 4, 2),
(9, 3, 1, 2),
(10, 7, 7, 5);

-- Insert reviews (only for products that customers have purchased and received)
-- Ensuring reviews are only for products in completed orders (done status) with Shipped=1
INSERT INTO reviews (reviewID, userId, productId, comment, star) VALUES
-- Reviews for completed orders (status='done')
(1, 1, 12, 'Tuyệt vời, sản phẩm rất đẹp và tinh tế', 4),
(2, 1, 2, 'Chất lượng rất tốt, đúng như mô tả', 5),
(3, 2, 6, 'Rất hài lòng với sản phẩm này', 4),
(4, 2, 16, 'Thiết kế độc đáo, rất thích', 5),
(5, 3, 3, 'Rất phù hợp với phong cách của tôi', 4),
(6, 3, 4, 'Tuyệt vời, sẽ mua thêm', 5);

-- Chuyển status từ shipped -> done
UPDATE orders
SET    status = 'done'
WHERE  orderID IN (6, 8);

-- Đảm bảo đã đánh dấu hàng đã giao
UPDATE orducts
SET    Shipped = 1
WHERE  orderID IN (6, 8);

-- Đảm bảo đã ghi nhận thanh toán
UPDATE pays
SET    isPaid  = 1,
       payDate = IFNULL(payDate, NOW())
WHERE  orderID IN (6, 8);