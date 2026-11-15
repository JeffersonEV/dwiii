package com.sistematecnologico.config;

import com.sistematecnologico.entity.Banner;
import com.sistematecnologico.entity.Categoria;
import com.sistematecnologico.entity.Configuracion;
import com.sistematecnologico.entity.Producto;
import com.sistematecnologico.entity.Rol;
import com.sistematecnologico.entity.Usuario;
import com.sistematecnologico.repository.BannerRepository;
import com.sistematecnologico.repository.CategoriaRepository;
import com.sistematecnologico.repository.ConfiguracionRepository;
import com.sistematecnologico.repository.ProductoRepository;
import com.sistematecnologico.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UsuarioRepository usuarioRepository;
    private final CategoriaRepository categoriaRepository;
    private final ProductoRepository productoRepository;
    private final BannerRepository bannerRepository;
    private final ConfiguracionRepository configuracionRepository;
    private final PasswordEncoder passwordEncoder;
    private final String adminPassword;
    private final String clientePassword;

    public DataInitializer(UsuarioRepository usuarioRepository,
                           CategoriaRepository categoriaRepository,
                           ProductoRepository productoRepository,
                           BannerRepository bannerRepository,
                           ConfiguracionRepository configuracionRepository,
                           PasswordEncoder passwordEncoder,
                           @Value("${app.seed.admin-password:}") String adminPassword,
                           @Value("${app.seed.cliente-password:}") String clientePassword) {
        this.usuarioRepository = usuarioRepository;
        this.categoriaRepository = categoriaRepository;
        this.productoRepository = productoRepository;
        this.bannerRepository = bannerRepository;
        this.configuracionRepository = configuracionRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminPassword = adminPassword;
        this.clientePassword = clientePassword;
    }

    @Override
    public void run(String... args) {
        crearUsuarios();
        crearCatalogo();
        crearBanners();
        crearConfiguracion();
    }

    private void crearUsuarios() {
        if (!usuarioRepository.existsByEmail("admin@techstore.com")) {
            if (passwordVacio(adminPassword)) {
                log.warn("Usuario ADMIN inicial no creado: define app.seed.admin-password");
            } else {
                usuarioRepository.save(Usuario.builder()
                        .nombre("Admin")
                        .apellido("TechStore")
                        .email("admin@techstore.com")
                        .password(passwordEncoder.encode(adminPassword))
                        .rol(Rol.ADMIN)
                        .activo(true)
                        .build());
                log.info("Usuario ADMIN inicial creado: admin@techstore.com");
            }
        }

        if (!usuarioRepository.existsByEmail("cliente@techstore.com")) {
            if (passwordVacio(clientePassword)) {
                log.warn("Usuario CLIENTE inicial no creado: define app.seed.cliente-password");
            } else {
                usuarioRepository.save(Usuario.builder()
                        .nombre("Cliente")
                        .apellido("TechStore")
                        .email("cliente@techstore.com")
                        .password(passwordEncoder.encode(clientePassword))
                        .rol(Rol.CLIENTE)
                        .activo(true)
                        .build());
                log.info("Usuario CLIENTE inicial creado: cliente@techstore.com");
            }
        }
    }

    private boolean passwordVacio(String password) {
        return password == null || password.isBlank();
    }

    private void crearCatalogo() {
        Categoria laptops = categoria("Laptops", "Computadoras portatiles para trabajo y gaming");
        Categoria celulares = categoria("Celulares", "Smartphones de ultima generacion");
        Categoria perifericos = categoria("Perifericos", "Teclados, mouses, monitores y accesorios");
        Categoria audio = categoria("Audio", "Audifonos, parlantes y microfonos");
        Categoria componentes = categoria("Componentes", "Tarjetas, memorias y almacenamiento");

        List<Producto> catalogo = List.of(
                producto("Laptop Lenovo IdeaPad 3i", "Intel Core i3, 8GB RAM, 512GB SSD", "4599.90", 12, "Lenovo",
                        "/productos/lenovo-ideapad-3i.webp", laptops),
                producto("MacBook Air M3", "Apple M3, 8GB RAM, 256GB SSD", "5249.00", 6, "Apple",
                        "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b4/MacBook_Air_%28Early_2015%29.jpg/960px-MacBook_Air_%28Early_2015%29.jpg", laptops),
                producto("Asus TUF Gaming F15", "Intel i7, RTX 4060, 16GB RAM", "5899.00", 5, "Asus",
                        "/productos/asus-tuf-gaming-f15.webp", laptops),
                producto("HP Victus 15", "Intel i5, RTX 3050, 16GB RAM", "3499.00", 9, "HP",
                        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=900&h=900&q=70", laptops),
                producto("Dell Inspiron 14", "Intel i5, 8GB RAM, 512GB SSD", "2799.00", 11, "Dell",
                        "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bd/Laptop_computer.jpeg/960px-Laptop_computer.jpeg", laptops),
                producto("Acer Aspire 5", "Ryzen 5, 16GB RAM, 512GB SSD", "2499.00", 18, "Acer",
                        "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=900&h=900&q=70", laptops),
                producto("MSI Katana 15", "Intel i7, RTX 4060, 16GB RAM", "5299.00", 4, "MSI",
                        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&h=900&q=70", laptops),
                producto("ASUS ROG Zephyrus G14", "Ryzen 9, RTX 4070, 32GB RAM", "7899.00", 3, "Asus",
                        "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/37/Schenker_VIA14_Laptop_asv2021-01.jpg/960px-Schenker_VIA14_Laptop_asv2021-01.jpg", laptops),

                producto("Samsung Galaxy S24", "6.2\", 256GB, 8GB RAM", "3299.90", 15, "Samsung",
                        "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/46/Samsung_Galaxy_S24_%28webtekno%29_008.png/960px-Samsung_Galaxy_S24_%28webtekno%29_008.png", celulares),
                producto("iPhone 15", "6.1\", 128GB, A16 Bionic", "3599.00", 10, "Apple",
                        "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f9/Back_of_iPhone_15.jpg/960px-Back_of_iPhone_15.jpg", celulares),
                producto("Xiaomi Redmi Note 13 Pro", "6.67\", 256GB, 8GB RAM, camara 200MP", "1099.00", 25, "Xiaomi",
                        "/productos/xiaomi-redmi-note-13-pro.webp", celulares),
                producto("iPhone 14", "6.1\", 128GB, A15 Bionic", "2999.00", 12, "Apple",
                        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=900&h=900&q=70", celulares),
                producto("Samsung Galaxy A55", "6.6\", 256GB, 8GB RAM", "1499.00", 22, "Samsung",
                        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&h=900&q=70", celulares),
                producto("Motorola Edge 50", "6.7\", 256GB, 12GB RAM", "1699.00", 14, "Motorola",
                        "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/89/Smartphone_display_screen.jpg/960px-Smartphone_display_screen.jpg", celulares),
                producto("Xiaomi 14", "6.36\", 512GB, 12GB RAM", "2699.00", 7, "Xiaomi",
                        "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7b/Smartphone_di_varie_marche.png/960px-Smartphone_di_varie_marche.png", celulares),

                producto("Teclado Mecanico Redragon", "Switch red, retroiluminado RGB", "199.90", 40, "Redragon",
                        "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/Mechanical_Keyboard.jpg/960px-Mechanical_Keyboard.jpg", perifericos),
                producto("Mouse Logitech G502", "Sensor HERO 25K, 11 botones", "299.90", 35, "Logitech",
                        "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/58/Logitech_G500_20100311%2C_top_photo.jpg/960px-Logitech_G500_20100311%2C_top_photo.jpg", perifericos),
                producto("Monitor LG UltraGear 27\"", "27\" IPS 4K UHD 240Hz / FHD 480Hz", "2595.00", 8, "LG",
                        "/productos/monitor-lg-ultragear-27.webp", perifericos),
                producto("Teclado Logitech MX Keys", "Inalambrico, retroiluminado, multidispositivo", "429.00", 16, "Logitech",
                        "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c4/Backlit_keyboard.jpg/960px-Backlit_keyboard.jpg", perifericos),
                producto("Mouse Razer DeathAdder V3", "Sensor 30K DPI, 8 botones", "349.00", 21, "Razer",
                        "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/71/2023_Mysz_komputerowa_Logitech_G903_Lightspeed.jpg/960px-2023_Mysz_komputerowa_Logitech_G903_Lightspeed.jpg", perifericos),
                producto("Monitor Samsung Odyssey G5", "27\" QHD, 165Hz, 1ms", "1299.00", 6, "Samsung",
                        "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/34/EIZO_Foris_FG2421_VGA_computer_monitor_displaying_test_pattern.png/960px-EIZO_Foris_FG2421_VGA_computer_monitor_displaying_test_pattern.png", perifericos),
                producto("Monitor AOC 24\"", "24\" LED curvo, VGA, 1ms", "986.40", 0, "AOC",
                        "/productos/monitor-aoc-24.webp", perifericos),

                producto("Audifonos Sony WH-1000XM5", "Cancelacion de ruido, 30h bateria", "1599.00", 14, "Sony",
                        "/productos/sony-wh1000xm5.webp", audio),
                producto("Parlante JBL Flip 6", "Bluetooth, resistente al agua, 12h bateria", "349.00", 20, "JBL",
                        "/productos/jbl-flip-6.webp", audio),
                producto("Audifonos JBL Tune 770NC", "Cancelacion de ruido, 70h bateria", "449.00", 18, "JBL",
                        "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/40/Headphones_1.jpg/960px-Headphones_1.jpg", audio),
                producto("Parlante Sony SRS-XB100", "Bluetooth, resistente al agua, 16h", "249.00", 24, "Sony",
                        "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/32/JBL_GO2_Bluetooth_speaker_00_10_27_681000_%28turned_upright%29.jpeg/960px-JBL_GO2_Bluetooth_speaker_00_10_27_681000_%28turned_upright%29.jpeg", audio),
                producto("Audifonos Audio-Technica ATH-M50x", "Profesionales, estudio, plegables", "749.00", 5, "Audio-Technica",
                        "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/63/Headphones_on_white_background.jpg/960px-Headphones_on_white_background.jpg", audio),
                producto("Parlante JBL Charge 5", "Bluetooth, powerbank, resistente al agua", "699.00", 11, "JBL",
                        "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/67/JBL_Flip_3_bluetooth_speaker_%28DSCF2653%29.jpg/330px-JBL_Flip_3_bluetooth_speaker_%28DSCF2653%29.jpg", audio),

                producto("SSD NVMe Kingston 1TB", "PCIe Gen4, 7000MB/s", "369.90", 30, "Kingston",
                        "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/28/Samsung_870_QVO_8TB_SATA_2%2C5_Zoll_Internes_Solid_State_Drive_%28SSD%29_%28MZ-77Q8T0BW%29_20211008_SSD023_corr.png/330px-Samsung_870_QVO_8TB_SATA_2%2C5_Zoll_Internes_Solid_State_Drive_%28SSD%29_%28MZ-77Q8T0BW%29_20211008_SSD023_corr.png", componentes),
                producto("Memoria RAM Corsair 32GB (2x16GB) DDR5", "Kit 2x16GB DDR5 5200MHz RGB blanco", "396.00", 3, "Corsair",
                        "/productos/ram-corsair-32gb.webp", componentes),
                producto("Tarjeta de video MSI RTX 4060 Ventus", "8GB GDDR6, DLSS 3", "1699.00", 8, "MSI",
                        "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=900&h=900&q=70", componentes),
                producto("SSD Samsung 980 PRO 1TB", "PCIe 4.0, 7000MB/s, NVMe", "449.00", 25, "Samsung",
                        "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/75/Samsung_980_PRO_PCIe_4.0_NVMe_SSD_1TB-top_PNr%C2%B00915.jpg/960px-Samsung_980_PRO_PCIe_4.0_NVMe_SSD_1TB-top_PNr%C2%B00915.jpg", componentes),
                producto("Gabinete NZXT H5 Flow", "ATX, vidrio templado, flujo de aire", "379.00", 10, "NZXT",
                        "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/31/Hyte_Y70_computer_case_Computex_2025.jpg/960px-Hyte_Y70_computer_case_Computex_2025.jpg", componentes),
                producto("Tarjeta de video AMD Radeon RX 6600", "8GB GDDR6, FidelityFX", "1099.00", 5, "AMD",
                        "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f3/Sapphire-Radeon-HD-5570-Video-Card.jpg/960px-Sapphire-Radeon-HD-5570-Video-Card.jpg", componentes)
        );

        int creados = 0;
        for (Producto producto : catalogo) {
            if (!productoRepository.existsByNombreIgnoreCase(producto.getNombre())) {
                productoRepository.save(producto);
                creados++;
            }
        }

        log.info("Catalogo verificado: {} categorias, {} productos ({} nuevos)",
                categoriaRepository.count(), productoRepository.count(), creados);
    }

    private Categoria categoria(String nombre, String descripcion) {
        return categoriaRepository.findByNombreIgnoreCase(nombre)
                .orElseGet(() -> categoriaRepository.save(Categoria.builder()
                        .nombre(nombre)
                        .descripcion(descripcion)
                        .build()));
    }

    private Producto producto(String nombre, String descripcion, String precio, int stock,
                              String marca, String imagenUrl, Categoria categoria) {
        return Producto.builder()
                .nombre(nombre)
                .descripcion(descripcion)
                .precio(new BigDecimal(precio))
                .stock(stock)
                .marca(marca)
                .imagenUrl(imagenUrl)
                .activo(true)
                .categoria(categoria)
                .build();
    }

    private void crearBanners() {
        List<Banner> semilla = List.of(
                Banner.builder()
                        .titulo("Tecnología que impulsa tu mundo")
                        .subtitulo("Descubre laptops, celulares y accesorios de las mejores marcas.")
                        .imagenUrl("https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&h=700&q=70")
                        .textoBoton("Ver catálogo")
                        .enlaceUrl("/catalogo")
                        .orden(1)
                        .activo(true)
                        .build(),
                Banner.builder()
                        .titulo("Hasta 30% de descuento")
                        .subtitulo("Ofertas exclusivas en audio y periféricos por tiempo limitado.")
                        .imagenUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&h=700&q=70")
                        .textoBoton("Aprovechar ofertas")
                        .enlaceUrl("/catalogo")
                        .orden(2)
                        .activo(true)
                        .build(),
                Banner.builder()
                        .titulo("Potencia tu setup gamer")
                        .subtitulo("Monitores, teclados y mouse de alto rendimiento te esperan.")
                        .imagenUrl("https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1600&h=700&q=70")
                        .textoBoton("Ver productos")
                        .enlaceUrl("/catalogo")
                        .orden(3)
                        .activo(true)
                        .build(),
                Banner.builder()
                        .titulo("Los smartphones más buscados")
                        .subtitulo("Renueva tu equipo con cámaras, batería y rendimiento de última generación.")
                        .imagenUrl("https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1600&h=700&q=70")
                        .textoBoton("Ver celulares")
                        .enlaceUrl("/catalogo")
                        .orden(4)
                        .activo(true)
                        .build(),
                Banner.builder()
                        .titulo("Renueva tu laptop")
                        .subtitulo("Modelos para estudio, trabajo y gaming con garantía oficial.")
                        .imagenUrl("https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1600&h=700&q=70")
                        .textoBoton("Ver laptops")
                        .enlaceUrl("/catalogo")
                        .orden(5)
                        .activo(true)
                        .build()
        );

        int creados = 0;
        int actualizados = 0;
        for (Banner banner : semilla) {
            Optional<Banner> existente = bannerRepository.findByTituloIgnoreCase(banner.getTitulo());
            if (existente.isPresent()) {
                Banner actual = existente.get();
                if ((actual.getImagenUrl() == null || actual.getImagenUrl().isBlank())
                        && banner.getImagenUrl() != null) {
                    actual.setImagenUrl(banner.getImagenUrl());
                    bannerRepository.save(actual);
                    actualizados++;
                }
            } else {
                bannerRepository.save(banner);
                creados++;
            }
        }

        log.info("Banners verificados: {} ({} nuevos, {} actualizados)",
                bannerRepository.count(), creados, actualizados);
    }

    private void crearConfiguracion() {
        if (configuracionRepository.existsById(1L)) {
            return;
        }
        configuracionRepository.save(Configuracion.builder()
                .id(1L)
                .nombreTienda("TechStore")
                .descripcion("Tienda especializada en tecnología: laptops, celulares, audio y componentes.")
                .build());
        log.info("Configuracion inicial creada");
    }
}
