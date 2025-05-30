document.addEventListener('DOMContentLoaded', function() {
    // 初始化数据
    let categories = JSON.parse(localStorage.getItem('websiteCategories')) || [
        {
            id: 'default',
            name: '常用网站',
            sites: [
                { name: 'Google', url: 'https://google.com', icon: 'fab fa-google' },
                { name: '百度', url: 'https://baidu.com', icon: 'fas fa-globe-asia' },
                { name: 'GitHub', url: 'https://github.com', icon: 'fab fa-github' },
                { name: 'YouTube', url: 'https://youtube.com', icon: 'fab fa-youtube' },
                { name: '淘宝', url: 'https://taobao.com', icon: 'fas fa-shopping-cart' },
                { name: '京东', url: 'https://jd.com', icon: 'fas fa-box' }
            ]
        },
        {
            id: 'entertainment',
            name: '娱乐休闲',
            sites: [
                { name: 'Bilibili', url: 'https://bilibili.com', icon: 'fas fa-play-circle' },
                { name: 'Netflix', url: 'https://netflix.com', icon: 'fas fa-film' }
            ]
        }
    ];

    // DOM元素
    const categoriesContainer = document.getElementById('categoriesContainer');
    const addCategoryBtn = document.getElementById('addCategoryBtn');
    const addSiteBtn = document.getElementById('addSiteBtn');
    const categoryModal = document.getElementById('categoryModal');
    const siteModal = document.getElementById('siteModal');
    const categoryForm = document.getElementById('categoryForm');
    const siteForm = document.getElementById('siteForm');
    const siteCategorySelect = document.getElementById('siteCategory');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    // 关闭模态框
    const closeBtns = document.querySelectorAll('.close');
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryModal.style.display = 'none';
            siteModal.style.display = 'none';
        });
    });

    // 点击模态框外部关闭
    window.addEventListener('click', function(event) {
        if (event.target === categoryModal) {
            categoryModal.style.display = 'none';
        }
        if (event.target === siteModal) {
            siteModal.style.display = 'none';
        }
    });

    // 显示添加分类模态框
    addCategoryBtn.addEventListener('click', function() {
        categoryModal.style.display = 'flex';
        document.getElementById('categoryName').focus();
    });

    // 显示添加网站模态框
    addSiteBtn.addEventListener('click', function() {
        // 填充分类选项
        siteCategorySelect.innerHTML = '';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            siteCategorySelect.appendChild(option);
        });
        
        siteModal.style.display = 'flex';
        document.getElementById('siteName').focus();
    });

    // 添加新分类
    categoryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('categoryName').value.trim();
        if (name) {
            const newCategory = {
                id: 'category-' + Date.now(),
                name: name,
                sites: []
            };
            categories.push(newCategory);
            saveAndRender();
            categoryModal.style.display = 'none';
            categoryForm.reset();
        }
    });

    // 添加新网站
    siteForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('siteName').value.trim();
        const url = document.getElementById('siteUrl').value.trim();
        const icon = document.getElementById('siteIcon').value.trim();
        const categoryId = siteCategorySelect.value;
        
        if (name && url && categoryId) {
            const newSite = {
                name: name,
                url: url.startsWith('http') ? url : 'https://' + url,
                icon: icon || 'fas fa-globe'
            };
            
            const category = categories.find(cat => cat.id === categoryId);
            if (category) {
                category.sites.push(newSite);
                saveAndRender();
                siteModal.style.display = 'none';
                siteForm.reset();
            }
        }
    });

    // 删除分类
    function deleteCategory(id) {
        if (confirm('确定要删除这个分类及其所有网站吗？')) {
            categories = categories.filter(category => category.id !== id);
            saveAndRender();
        }
    }

    // 删除网站
    function deleteSite(categoryId, siteIndex) {
        if (confirm('确定要删除这个网站吗？')) {
            const category = categories.find(cat => cat.id === categoryId);
            if (category) {
                category.sites.splice(siteIndex, 1);
                saveAndRender();
            }
        }
    }

    // 搜索网站
    function searchSites(query) {
        const results = [];
        const lowerQuery = query.toLowerCase();
        
        categories.forEach(category => {
            const matchedSites = category.sites.filter(site => 
                site.name.toLowerCase().includes(lowerQuery) || 
                site.url.toLowerCase().includes(lowerQuery)
            );
            
            if (matchedSites.length > 0) {
                results.push({
                    ...category,
                    sites: matchedSites
                });
            }
        });
        
        renderCategories(results);
    }

    searchBtn.addEventListener('click', function() {
        const query = searchInput.value.trim();
        if (query) {
            searchSites(query);
        } else {
            renderCategories(categories);
        }
    });

    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                searchSites(query);
            } else {
                renderCategories(categories);
            }
        }
    });

    // 保存数据到本地存储并渲染
    function saveAndRender() {
        localStorage.setItem('websiteCategories', JSON.stringify(categories));
        renderCategories(categories);
    }

    // 渲染分类和网站
    function renderCategories(cats) {
        categoriesContainer.innerHTML = '';
        
        if (cats.length === 0) {
            categoriesContainer.innerHTML = '<p class="no-results">没有找到匹配的网站</p>';
            return;
        }
        
        cats.forEach(category => {
            const categoryElement = document.createElement('div');
            categoryElement.className = 'category';
            categoryElement.innerHTML = `
                <h2>${category.name} <span class="delete-category" data-id="${category.id}"><i class="fas fa-trash-alt"></i></span></h2>
                <div class="sites">
                    ${category.sites.map((site, index) => `
                        <a href="${site.url}" target="_blank" class="site">
                            <div class="site-icon">
                                ${site.icon ? `<i class="${site.icon}"></i>` : '<i class="fas fa-globe"></i>'}
                            </div>
                            <div class="site-name">${site.name}</div>
                            <div class="site-delete" data-category="${category.id}" data-index="${index}"><i class="fas fa-times"></i></div>
                        </a>
                    `).join('')}
                </div>
            `;
            
            categoriesContainer.appendChild(categoryElement);
        });
        
        // 添加删除分类事件监听
        document.querySelectorAll('.delete-category').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                deleteCategory(this.getAttribute('data-id'));
            });
        });
        
        // 添加删除网站事件监听
        document.querySelectorAll('.site-delete').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const categoryId = this.getAttribute('data-category');
                const siteIndex = parseInt(this.getAttribute('data-index'));
                deleteSite(categoryId, siteIndex);
            });
        });
    }

    // 初始渲染
    renderCategories(categories);
});
