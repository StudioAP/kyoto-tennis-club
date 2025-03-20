/**
 * 京都ローンテニスクラブ Webサイト JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // ナビゲーションメニューの動作
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            menu.classList.toggle('active');
        });
    }

    // スクロールアニメーション
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // お知らせ管理機能
    // モーダル要素
    const adminModal = document.getElementById('admin-modal');
    const newsEditorModal = document.getElementById('news-editor-modal');
    const closeBtns = document.querySelectorAll('.close');

    // 管理者ログインへのアクセス（フッターのコピーライトをクリックするとログイン画面表示）
    const copyrightEl = document.querySelector('.copyright');
    if (copyrightEl) {
        copyrightEl.addEventListener('click', function() {
            adminModal.style.display = 'block';
        });
    }

    // モーダルを閉じる
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            adminModal.style.display = 'none';
            newsEditorModal.style.display = 'none';
        });
    });

    // モーダル外をクリックして閉じる
    window.addEventListener('click', function(event) {
        if (event.target === adminModal) {
            adminModal.style.display = 'none';
        }
        if (event.target === newsEditorModal) {
            newsEditorModal.style.display = 'none';
        }
    });

    // 管理者ログインフォーム送信
    const adminLoginForm = document.getElementById('admin-login-form');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const password = document.getElementById('password').value;
            
            // 実際の運用ではサーバーサイドで検証すべきですが、
            // デモのためにシンプルなパスワード検証を実装
            if (password === 'tennis2025') { // この部分は実装時に適切に変更してください
                adminModal.style.display = 'none';
                newsEditorModal.style.display = 'block';
                loadExistingNews();
            } else {
                alert('パスワードが正しくありません。');
            }
        });
    }

    // 既存のお知らせをフォームに読み込む
    function loadExistingNews() {
        const newsContainer = document.getElementById('news-container');
        if (!newsContainer) return;

        const newsItems = newsContainer.querySelectorAll('.news-item');
        if (newsItems.length > 0) {
            const latestNews = newsItems[0]; // 最新のお知らせを取得
            
            // フォームに値を設定
            const dateEl = latestNews.querySelector('.news-date');
            const titleEl = latestNews.querySelector('.news-title');
            const contentEl = latestNews.querySelector('.news-content');
            
            if (dateEl && titleEl && contentEl) {
                document.getElementById('news-date').value = dateEl.textContent;
                document.getElementById('news-title').value = titleEl.textContent;
                
                // コンテンツはリスト形式なので、テキストとして抽出
                let contentText = '';
                const listItems = contentEl.querySelectorAll('li');
                listItems.forEach(item => {
                    contentText += item.textContent + '\\n';
                });
                
                document.getElementById('news-content').value = contentText.trim();
            }
        }
    }

    // お知らせ更新フォーム送信
    const newsEditorForm = document.getElementById('news-editor-form');
    if (newsEditorForm) {
        newsEditorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // フォームから値を取得
            const newsDate = document.getElementById('news-date').value;
            const newsTitle = document.getElementById('news-title').value;
            const newsContent = document.getElementById('news-content').value;
            
            // お知らせの内容を更新
            updateNewsContent(newsDate, newsTitle, newsContent);
            
            // お知らせをローカルストレージに保存（実際にはサーバーに保存）
            saveNewsToLocalStorage(newsDate, newsTitle, newsContent);
            
            // モーダルを閉じる
            newsEditorModal.style.display = 'none';
            
            alert('お知らせを更新しました。');
        });
    }

    // お知らせの内容をHTMLに更新
    function updateNewsContent(date, title, content) {
        const newsContainer = document.getElementById('news-container');
        if (!newsContainer) return;
        
        // コンテンツを改行で分割してリスト化
        const contentItems = content.split('\\n').filter(item => item.trim() !== '');
        let listItems = '';
        contentItems.forEach(item => {
            listItems += `<li>${item}</li>`;
        });
        
        // 新しいお知らせHTMLを作成
        const newsHTML = `
            <div class="news-item">
                <div class="news-date">${date}</div>
                <h3 class="news-title">${title}</h3>
                <div class="news-content">
                    <ul>
                        ${listItems}
                    </ul>
                </div>
            </div>
        `;
        
        // 既存のお知らせを置き換え
        newsContainer.innerHTML = newsHTML;
    }

    // お知らせをローカルストレージに保存（デモ用）
    function saveNewsToLocalStorage(date, title, content) {
        const newsData = {
            date: date,
            title: title,
            content: content
        };
        
        localStorage.setItem('kyotoTennisNews', JSON.stringify(newsData));
    }

    // ページロード時にローカルストレージからお知らせを読み込む
    function loadNewsFromLocalStorage() {
        const savedNews = localStorage.getItem('kyotoTennisNews');
        if (savedNews) {
            const newsData = JSON.parse(savedNews);
            updateNewsContent(newsData.date, newsData.title, newsData.content);
        }
    }
    
    // 保存されたお知らせがあれば読み込む
    loadNewsFromLocalStorage();
});
