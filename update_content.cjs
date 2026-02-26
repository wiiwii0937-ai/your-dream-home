const fs = require('fs');

try {
    const data = JSON.parse(fs.readFileSync('src/data/content.json', 'utf8'));

    data.projects.items = data.projects.items.map((p, i) => ({
        ...p,
        date: `2024-03-${String(25 - i).padStart(2, '0')}`,
        link: p.fbLink || '#'
    }));

    data.knowledgeBase = {
        hero: {
            title: '專業知識庫',
            description: '提供您最專業的輕鋼構建築知識、工法解析與案例分享，讓您更了解築安心的堅持。'
        },
        items: [
            {
                id: 1,
                title: '輕鋼構建築的基本原理與優勢介紹',
                image: '/images/projects/project-6.jpg',
                date: '2024-03-20',
                description: '深入了解輕鋼構建築為何能成為現代綠色建築的首選，以及它帶來的各種優勢。',
                link: '#'
            },
            {
                id: 2,
                title: '耐震防護：守護家人安全的建築關鍵',
                image: '/images/projects/project-2.jpg',
                date: '2024-03-15',
                description: '台灣位處地震帶，選擇適合的建築工法至關重要。解析輕鋼構的抗震性能。',
                link: '#'
            },
            {
                id: 3,
                title: '老屋翻新：輕鋼構增建的無限可能性',
                image: '/images/projects/project-8.jpg',
                date: '2024-03-10',
                description: '不想搬家但空間不夠？來看看輕鋼構如何以低干擾的方式，讓老屋重獲新生。',
                link: '#'
            }
        ]
    };

    fs.writeFileSync('src/data/content.json', JSON.stringify(data, null, 4));
    console.log('Update complete');
} catch (e) {
    console.error(e);
}
