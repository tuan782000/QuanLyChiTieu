import { Ionicons } from '@expo/vector-icons'; // bppj icon từ expo
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
        </Tabs>
    );
};

export default Layout;
