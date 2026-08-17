import HeaderCategory from '../models/HeaderCategory';

const DEFAULT_CATEGORIES = [
    {
        name: 'Wedding',
        iconLibrary: 'Custom', // Using 'Custom' to indicate it maps to internal SVGs
        iconName: 'wedding',
        image: '/women.jpg',
        slug: 'wedding',
        status: 'Published',
        order: 1
    },
    {
        name: 'Winter',
        iconLibrary: 'Custom',
        iconName: 'winter',
        image: '/cold.jpg',
        slug: 'winter',
        status: 'Published',
        order: 2
    },
    {
        name: 'Electronics',
        iconLibrary: 'Custom',
        iconName: 'electronics',
        slug: 'electronics',
        status: 'Published',
        order: 3
    },
    {
        name: 'Beauty',
        iconLibrary: 'Custom',
        iconName: 'beauty',
        image: '/personal.jpg',
        slug: 'beauty',
        status: 'Published',
        order: 4
    },
    {
        name: 'Grocery',
        iconLibrary: 'Custom',
        iconName: 'grocery',
        image: '/dairy.jpg',
        slug: 'grocery',
        status: 'Published',
        order: 5
    },
    {
        name: 'Fashion',
        iconLibrary: 'Custom',
        iconName: 'fashion',
        image: '/shirt1.jpg',
        slug: 'fashion',
        status: 'Published',
        order: 6
    },
    {
        name: 'Household',
        iconLibrary: 'Custom',
        iconName: 'bucket',
        image: '/bucket.jpg',
        slug: 'household',
        status: 'Published',
        order: 7
    },
    {
        name: 'Sports',
        iconLibrary: 'Custom',
        iconName: 'sports',
        slug: 'sports',
        status: 'Published',
        order: 8
    }
];

export async function seedHeaderCategories() {
    try {
        const count = await HeaderCategory.countDocuments();
        if (count > 0) {
            console.log('Header categories already exist. Skipping seed.');
            return;
        }

        await HeaderCategory.insertMany(DEFAULT_CATEGORIES);
        console.log('Default header categories seeded successfully.');
    } catch (error) {
        console.error('Error seeding header categories:', error);
    }
}
