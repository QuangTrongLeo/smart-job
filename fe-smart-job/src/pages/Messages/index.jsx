import React, { useState } from 'react';
import styles from './Messages.module.scss';

function Messages() {
  const [activeChat, setActiveChat] = useState(1);

  return (
    <div className={styles.messagesContainer}>
      {/* Left Column: Chat List */}
      <div className={styles.chatListColumn}>
        <div className={styles.searchBox}>
          <div className={styles.inputWrapper}>
            <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
            <input type="text" placeholder="Tìm kiếm tin nhắn..." />
          </div>
        </div>

        <div className={styles.chatListScroll}>
          {/* Chat Item 1 (Active) */}
          <div 
            className={`${styles.chatItem} ${activeChat === 1 ? styles.active : ''}`}
            onClick={() => setActiveChat(1)}
          >
            <div className={styles.avatarWrapper}>
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBteVNwlLtSeKiumVz8skvRAAl44h9CcHyuB76WuIkQE6e3aq7iqeAsDANYIhLNglSAIZXiRG9-3rNhQqZdUItVo3aF-Zn1TBaeXP0a4Pswh4-w7QHvbyO1q916sUxVD6QaMssNKR42gmUcmpX2td-v0vtJI3dnogA9LPDOvnVXm7T2_SolyDMzRDaA4dBfmzHDPhFWjIlQrkOwRA70Q2rqIfLg_23TGSW5Lx217y7cLRjEtua8ASs7" 
                alt="TechViet" 
              />
              <span className={styles.onlineDot}></span>
            </div>
            <div className={styles.chatMeta}>
              <div className={styles.itemHeader}>
                <h4>Công ty TNHH TechViet</h4>
                <span className={styles.time}>10:42 AM</span>
              </div>
              <p className={styles.lastMessage}>Bản thiết kế đã duyệt, bạn có thể bắt đầu code.</p>
            </div>
          </div>

          {/* Chat Item 2 */}
          <div 
            className={`${styles.chatItem} ${activeChat === 2 ? styles.active : ''}`}
            onClick={() => setActiveChat(2)}
          >
            <div className={styles.avatarWrapper}>
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfuby-APE0goMnJLzm06hcFIqtouDqvkWzBpXYhoolNwT_bAxBvISIR0TanInkbcZquq_buiJ38u3AXUSDBPTb34lzbAJ6thMhZZS3jLg0JvBJY60R37570VDjjrZ_qZ2qPx5TvwQCPOUOxhDM-MB5GY3CSmAcYz_GlqjrRVsR-OHjr36BgULitZReFehZVrNexZpEpo3zUd5PcA1b20KRaBOZbKeA__glImpaMYQ77zWQHoqNf7ah" 
                alt="Lê Thị B" 
              />
              <span className={styles.onlineDot}></span>
            </div>
            <div className={styles.chatMeta}>
              <div className={styles.itemHeader}>
                <h4>Lê Thị B (Design)</h4>
                <span className={styles.time}>Hôm qua</span>
              </div>
              <p className={styles.lastMessage}>Cảm ơn bạn. Hẹn gặp lại vào tuần tới.</p>
            </div>
          </div>

          {/* Chat Item 3 */}
          <div 
            className={`${styles.chatItem} ${activeChat === 3 ? styles.active : ''}`}
            onClick={() => setActiveChat(3)}
          >
            <div className={styles.avatarWrapper}>
              <div className={styles.avatarText}>SM</div>
            </div>
            <div className={styles.chatMeta}>
              <div className={styles.itemHeader}>
                <h4>SmartJob Support</h4>
                <span className={styles.time}>T2</span>
              </div>
              <p className={styles.lastMessage}>Hồ sơ của bạn đã được xác minh thành công.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Column: Chat Window */}
      <div className={styles.chatWindowColumn}>
        {/* Chat Header */}
        <div className={styles.chatHeader}>
          <div className={styles.userInfo}>
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTsJvbMZdRi9f-vGFN_btkETBTxZvx0LChGlI5ubQvWeAGjwLhUXhIYyYER_9fC1SDmPWzMx0WFQcGyyGaXnvK4JP-FUj9Knc6L_MW5YbG4lQj_8XWYNKLg7JJFtjrqzUAyialOGMDOg4Bc6k-_BhDQNaJBxHCJ_MrXEu1gxYhoOJcSWhcN63B_DEgb2zQKg3b9lPIcstiSXfOBrG-7SWomEvtT7UuX0LoIdNjU71E9Gtzy2zolQaa" 
              alt="TechViet" 
            />
            <div>
              <h2>Công ty TNHH TechViet</h2>
              <p className={styles.statusText}>
                <span className={styles.greenDot}></span> Đang hoạt động
              </p>
            </div>
          </div>
          <div className={styles.headerActions}>
            <button title="Gọi thoại">
              <span className="material-symbols-outlined">call</span>
            </button>
            <button title="Gọi video">
              <span className="material-symbols-outlined">videocam</span>
            </button>
            <button title="Thêm tuỳ chọn">
              <span className="material-symbols-outlined">more_vert</span>
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className={styles.messagesArea}>
          <div className={styles.timeDivider}>
            <span>Hôm nay, 09:30 AM</span>
          </div>

          {/* Received Message */}
          <div className={styles.msgRow}>
            <img 
              className={styles.avatar}
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDf6M-LoMEjxCxde2hNe62DMm5pnftC_yrLwkYwiMkUwjN03gythGtJDQ6lSAX6XCL6B3LRHkIB7yYzAFnO2MYKiZ_NKf_g4OeHULqnfMmcx5XkK-fWU7o52GH8OYNfw8A-Gadv-zRhh0_UCgkL1bO5w1R7MvoirCIBevCwt972Uc5PGkFvf95cUkvRMNlQ_DRJ1FJZbf_AxQPy19rizhJvJmEsrCAooFlI9ZJDAJNhOHAyt1FVvHvh" 
              alt="Avatar" 
            />
            <div>
              <div className={styles.msgBubble}>
                <p>Chào bạn, chúng tôi đã xem qua portfolio của bạn và rất ấn tượng với dự án E-commerce gần đây.</p>
              </div>
              <span className={styles.msgTime}>09:30 AM</span>
            </div>
          </div>

          {/* Received Message */}
          <div className={styles.msgRow}>
            <div className={styles.avatarSpacer}></div>
            <div>
              <div className={styles.msgBubble}>
                <p>Bạn có thể bắt đầu dự án thiết kế UI/UX cho app tài chính của chúng tôi vào thứ Hai tuần tới không?</p>
              </div>
              <span className={styles.msgTime}>09:32 AM</span>
            </div>
          </div>

          {/* Sent Message */}
          <div className={`${styles.msgRow} ${styles.sent}`}>
            <img 
              className={styles.avatar}
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9XNDMFcfky7KrFx5a51_l-496xjMLtC8CUrYxbmi_CK9OAWRL8ZZv-ph9LZqo7NxTDXje02oZaaitu9jFhSVGVPUUzNIigGfM4kBOgHw1skk0oC04_NCWpyHvgVwKgCGAqAOrWMSDG4jCVTHluac8hdHek3ZRysXbvoOP-9WcTJlwLrfu3sTAqD4mmiQmRlj4Rpl6OYP197MysvF67DXkEIHSs5anIDMEJ1XzRZXuPop0irWjwOGB" 
              alt="My Avatar" 
            />
            <div>
              <div className={styles.msgBubble}>
                <p>Chào anh, cảm ơn anh đã đánh giá cao portfolio của em.</p>
              </div>
            </div>
          </div>

          {/* Sent Message */}
          <div className={`${styles.msgRow} ${styles.sent}`}>
            <div className={styles.avatarSpacer}></div>
            <div>
              <div className={styles.msgBubble}>
                <p>Thứ Hai tuần tới em hoàn toàn có thể bắt đầu. Anh có thể gửi trước cho em file yêu cầu chi tiết (BRD) để em nghiên cứu cuối tuần được không ạ?</p>
              </div>
              <div className={styles.msgMeta}>
                <span className={styles.msgTime}>10:15 AM</span>
                <span className={`material-symbols-outlined ${styles.checkIcon}`}>done_all</span>
              </div>
            </div>
          </div>

          {/* Received Message with Attachment */}
          <div className={styles.msgRow}>
            <img 
              className={styles.avatar}
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEGfKcFIfEjlgjVKnjHEWRBtuF9EOs6NstRAiClymAbfbCslOV1_TBHpZ1YILcUgOWsC5jBQ-Sg1LB_ExU22cpLINQyYy3006lzrd7mvH4L7z3A8wx_drgbVparB_5_r2NKd-zp_Ac2jyRGb4nlw-2jW7j22OkHhcAioFWhiB3ZyAZcR7o7qTGtUog8u-cadVzkN-qy_tutGT7rd2htV5_6sjeCxE9ccoqedYz7Q5_AnS1X1Ee8Zo7" 
              alt="Avatar" 
            />
            <div>
              <div className={styles.msgBubble}>
                <p>Chắc chắn rồi. File đính kèm nhé.</p>
                <div className={styles.attachment}>
                  <span className={`material-symbols-outlined ${styles.pdfIcon}`}>picture_as_pdf</span>
                  <div className={styles.fileInfo}>
                    <p>Fintech_App_BRD_v1.2.pdf</p>
                    <span>2.4 MB</span>
                  </div>
                  <span className="material-symbols-outlined">download</span>
                </div>
              </div>
              <span className={styles.msgTime}>10:40 AM</span>
            </div>
          </div>

          {/* Received Message */}
          <div className={styles.msgRow}>
            <div className={styles.avatarSpacer}></div>
            <div>
              <div className={styles.msgBubble}>
                <p>Bản thiết kế đã duyệt, bạn có thể bắt đầu code.</p>
              </div>
              <span className={styles.msgTime}>10:42 AM</span>
            </div>
          </div>
        </div>

        {/* Chat Input Area */}
        <div className={styles.chatInputArea}>
          <div className={styles.inputBox}>
            <button title="Đính kèm file">
              <span className="material-symbols-outlined">attach_file</span>
            </button>
            <textarea placeholder="Nhập tin nhắn..." rows={1}></textarea>
            <button title="Biểu tượng cảm xúc">
              <span className="material-symbols-outlined">mood</span>
            </button>
            <button className={styles.btnSend} title="Gửi tin nhắn">
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Context Info */}
      <div className={styles.contextColumn}>
        <div className={styles.companyHeader}>
          <img 
            className={styles.logoImg}
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_nL3gowIe-nNQygzv6y7FQqGU38jtkXA-m9Rw1BC5SuyD4kfBtCtIXk5KhWKPfeBJE2AeF_AuGh3PnhNTZhccA_YMUh7_GaLT79MzBhxrvZkYw_xn89bWPMox26mserBkIKiXcC8bVkliuGFw0rKlDqXsS7KPjW1RgXb3t1oz-sr8wYWE2KsnOG-Czi2iEHupEJiEyGKIc-ntpocIlt8Gjo1mGogMukofvb3Otkw343WYr41dySxu" 
            alt="Company Logo" 
          />
          <h3>Công ty TNHH TechViet</h3>
          <p className={styles.location}>
            <span className="material-symbols-outlined">location_on</span>
            Hà Nội, Việt Nam
          </p>
          <div className={styles.tags}>
            <span>Agency</span>
            <span>Tech</span>
          </div>
        </div>

        <div className={styles.projectSection}>
          <h4>Dự án hiện tại</h4>
          <div className={styles.projectCard}>
            <h5>Thiết kế UI/UX App Tài chính (Fintech)</h5>
            <p>Cần tìm UI/UX designer có kinh nghiệm làm app tài chính, thiết kế theo hướng modern, clean.</p>
            <div className={styles.cardFooter}>
              <span className={styles.price}>15.000.000 VNĐ</span>
              <span className={styles.status}>Đang thực hiện</span>
            </div>
          </div>
        </div>

        <div className={styles.filesSection}>
          <h4>Tài liệu chia sẻ</h4>
          <div className={styles.fileList}>
            <div className={styles.fileItem}>
              <div className={`${styles.iconBox} ${styles.pdf}`}>
                <span className="material-symbols-outlined">picture_as_pdf</span>
              </div>
              <div className={styles.fileMeta}>
                <p>Fintech_App_BRD_v1.2.pdf</p>
                <span>Hôm nay • 2.4 MB</span>
              </div>
            </div>

            <div className={styles.fileItem}>
              <div className={`${styles.iconBox} ${styles.img}`}>
                <span className="material-symbols-outlined">image</span>
              </div>
              <div className={styles.fileMeta}>
                <p>Wireframe_sketch.png</p>
                <span>Hôm qua • 1.1 MB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messages;