import { Ionicons } from '@expo/vector-icons'; // bộ icon từ Expo (Ionicons)
import { Tabs } from 'expo-router'; // import tán để thanh điều hướng dạng tab

const Layout = () => {
    return (
        <Tabs>
            <Tabs.Screen
                name='index' // Tên file route: app/(tab)/index.tsx
                options={{
                    title: 'Thu / Chi', // Tiều đề hiển thị ở tab
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name='list' size={size} color={color} /> // Icon cho tab này
                    )
                }}
            />
            <Tabs.Screen
                name='add' // Tên file route: app/(tab)/add.tsx
                options={{
                    title: 'Thêm',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name='add-circle' size={size} color={color} />
                    )
                }}
            />
            <Tabs.Screen
                name='category' // Tên file route: app/(tab)/category.tsx
                options={{
                    title: 'Danh mục',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name='folder' size={size} color={color} />
                    )
                }}
            />
            <Tabs.Screen
                name='report' // Tên file route: app/(tab)/report.tsx
                options={{
                    title: 'Báo cáo',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name='pie-chart' size={size} color={color} />
                    )
                }}
            />
        </Tabs>
    );
};

export default Layout;
