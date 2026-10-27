import pprint
from build_hsk6 import HSK6_RAW

EXTRA_HSK6 = [
    ("纸上谈兵", "紙上談兵", "zhǐ shàng tán bīng", "zhi shang tan bing", "chỉ thượng đàm binh", "Bàn việc quân trên giấy, lý thuyết suông", "Armchair strategy, empty talk on paper", "Thành ngữ", 37, [("创业不能只是纸上谈兵，更需实干。", "Chuàngyè bù néng zhǐ shì zhǐshàngtánbīng, gèng xū shígàn.", "Khởi nghiệp không thể chỉ bàn suông trên giấy, cần phải bắt tay vào làm thật.", "Starting a business cannot be mere armchair strategy, requires action.")]),
    ("掩耳盗铃", "掩耳盜鈴", "yǎn ěr dào líng", "yan er dao ling", "yểm nhĩ đạo linh", "Bịt tai trộm chuông, tự lừa dối chính mình", "Bury head in sand, deceive oneself", "Thành ngữ", 35, [("不愿正视客观问题纯粹是掩耳盗铃。", "Bú yuàn zhèngshì kèguān wèntí chúncuì shì yǎn'ěrdàolíng.", "Không muốn nhìn thẳng vào vấn đề khách quan đơn thuần là bịt tai trộm chuông tự lừa dối.", "Unwilling to face objective problems is purely deceiving oneself.")]),
    ("画蛇添足", "畫蛇添足", "huà shé tiān zú", "hua she tian zu", "họa xà thiêm túc", "Vẽ rắn thêm chân, làm chuyện thừa thãi hỏng việc", "Ruin by adding superfluous details", "Thành ngữ", 28, [("文章已经写得很完美，再改就是画蛇添足了。", "Wénzhāng yǐjīng xiě de hěn wánměi, zài gǎi jiù shì huàshétiānzú le.", "Bài viết đã rất hoàn hảo rồi, sửa nữa chỉ là vẽ rắn thêm chân.", "The article is already perfect, changing more is adding feet to snake.")]),
    ("守株待兔", "守株待兔", "shǒu zhū dài tù", "shou zhu dai tu", "thủ chu đãi thố", "Ôm cây đợi thỏ, ngồi chờ sung rụng", "Wait for windfall without working", "Thành ngữ", 29, [("在激烈的竞争中，守株待兔注定会被淘汰。", "Zài jīliè de jìngzhēng zhōng, shǒuzhūdàitù zhùdìng huì bèi táotài.", "Trong cạnh tranh khốc liệt, ngồi chờ sung rụng chắc chắn sẽ bị đào thải.", "In fierce competition, waiting for windfalls is destined to be phased out.")]),
    ("拔苗助长", "拔苗助長", "bá miáo zhù zhǎng", "ba miao zhu zhang", "bạt miêu trợ trưởng", "Kéo mạ giúp lớn, nóng vội dục tốc bất đạt", "Spoil things through excessive zeal", "Thành ngữ", 26, [("教育孩子要顺其自然，切不可拔苗助长。", "Jiàoyù háizi yào shùnqízìrán, qiè bùkě bámiáozhùzhǎng.", "Dạy dỗ con cái cần thuận theo tự nhiên, tuyệt đối chớ nóng vội kéo mạ.", "Educating children should follow nature, never spoil through zeal.")]),
    ("亡羊补牢", "亡羊補牢", "wáng yáng bǔ láo", "wang yang bu lao", "vong dương bổ lao", "Mất bò mới lo làm chuồng, sửa sai kịp thời", "Better late than never, mend fold after losing sheep", "Thành ngữ", 24, [("虽然遭受了挫折，但亡羊补牢为时不晚。", "Suīrán zāoshòu le cuòzhé, dàn wángyángbǔláo wéishí bù wǎn.", "Tuy chịu thất bại nhưng sửa sai kịp thời vẫn chưa muộn.", "Though suffered setbacks, mending the fold is not too late.")]),
    ("安居乐业", "安居樂業", "ān jū lè yè", "an ju le ye", "an cư lạc nghiệp", "An cư lạc nghiệp, cuộc sống thái bình ấm no", "Live in peace and work happily", "Thành ngữ", 34, [("国家繁荣昌盛，人民安居乐业。", "Guójiā fánróng chāngshèng, rénmín ānjūlèyè.", "Đất nước phồn vinh hưng thịnh, nhân dân an cư lạc nghiệp.", "The country prospers and people live in peace and work happily.")]),
    ("萍水相逢", "萍水相逢", "píng shuǐ xiāng féng", "ping shui xiang feng", "bèo thủy tương phùng", "Bèo nước gặp nhau, tình cờ tương ngộ", "Meet by chance like drifting duckweed", "Thành ngữ", 36, [("你我萍水相逢，却情同知己。", "Nǐ wǒ píngshuǐxiāngféng, què qíng tóng zhījǐ.", "Tôi và bạn tuy bèo nước gặp nhau, nhưng thân thiết như tri kỷ.", "We met by chance, yet feel as close as intimate friends.")]),
    ("望尘莫及", "望塵莫及", "wàng chén mò jí", "wang chen mo ji", "vọng trần mạc cập", "Không sao đuổi kịp, trông bụi sau xe mà thán phục", "Far behind, unable to catch up", "Thành ngữ", 36, [("他在科研领域的成就令人望尘莫及。", "Tā zài kēyán lǐngyù de chéngjiù lìngrén wàngchénmòjí.", "Thành tựu của ông trong nghiên cứu khoa học khiến người khác khôn bề sánh kịp.", "His achievements in scientific research leave others far behind.")]),
    ("别出心裁", "別出心裁", "bié chū xīn cái", "bie chu xin cai", "biệt xuất tâm tài", "Độc đáo sáng tạo, ý tưởng mới lạ", "Adopt an original approach, novel design", "Thành ngữ", 34, [("晚会的舞台设计别出心裁，惊艳全场。", "Wǎnhuì de wǔtái shèjì biéchūxīncái, jīngyàn quánchǎng.", "Thiết kế sân khấu đêm hội độc đáo mới lạ, làm rạng rỡ cả khán phòng.", "The gala stage design adopted an original approach that stunned all.")]),
    ("名副其实", "名副其實", "míng fù qí shí", "ming fu qi shi", "danh phó kỳ thực", "Danh xứng với thực, đúng như tên gọi", "Worthy of the name, veritable", "Thành ngữ", 33, [("张教授学识渊博，是名副其实的国学大师。", "Zhāng jiàoshòu xuéshí yuānbó, shì míngfùqíshí de guóxué dàshī.", "Giáo sư Trương học vấn uyên bác, đúng là bậc đại sư danh xứng với thực.", "Professor Zhang is erudite, a veritable master of sinology.")]),
    ("循规蹈矩", "循規蹈矩", "xún guī dǎo jǔ", "xun gui dao ju", "tuần quy đạo củ", "Tuân theo khuôn phép, đúng mực", "Follow rules docilely, toe the line", "Thành ngữ", 48, [("他做事实实在在，始终循规蹈矩。", "Tā zuòshì shízhe zàizài, shǐzhōng xúnguīdǎojǔ.", "Anh ấy làm việc thực tế, trước sau luôn theo đúng chuẩn mực.", "He does things solidly, always toeing the line.")]),
    ("脍炙人口", "膾炙人口", "kuài zhì rén kǒu", "kuai zhi ren kou", "khoái chích nhân khẩu", "Được truyền tụng khắp nơi, ai ai cũng khen hay", "Appealing to all, widely praised", "Thành ngữ", 34, [("这首脍炙人口的经典老歌传唱了半个世纪。", "Zhè shǒu kuàizhìrénkǒu de jīngdiǎn lǎogē chuánchàng le bàn gè shìjì.", "Bài hát kinh điển được mọi người truyền tụng này đã vang lên suốt nửa thế kỷ.", "This widely praised classic old song has been sung for half a century.")]),
    ("望梅止渴", "望梅止渴", "wàng méi zhǐ kě", "wang mei zhi ke", "vọng mai chỉ khát", "Trông mơ giải khát, tự an ủi bằng ảo tưởng", "Console oneself with false hopes", "Thành ngữ", 33, [("空喊口号不过是望梅止渴，解决不了实际温饱。", "Kōng hǎn kǒuhào búguò shì wàngméizhǐkě, jiějuébùliǎo shíjì wēnbǎo.", "Hô hào khẩu hiệu rỗng tuếch chỉ là trông mơ giải khát, không giải quyết được cơm áo gạo tiền.", "Empty slogans are merely consoling with false hopes.")]),
    ("滥竽充数", "濫竽充數", "làn yú chōng shù", "lan yu chong shu", "lạm vu sung số", "Đội lốt cho đủ số, bất tài giả vờ có tài", "Pass off incompetent person as capable", "Thành ngữ", 38, [("专业团队容不得任何滥竽充数者。", "Zhuānyè tuánduì róngbùdé rènhé lànyúchōngshù zhě.", "Đội ngũ chuyên nghiệp không chấp nhận bất kỳ kẻ nào đội lốt cho đủ chân.", "A professional team does not tolerate any incompetent impostors.")]),
    ("井底之蛙", "井底之蛙", "jǐng dǐ zhī wā", "jing di zhi wa", "tỉnh để chi oa", "Ếch ngồi đáy giếng, thiển cận hẹp hòi", "Frog in a well, person with limited vision", "Thành ngữ", 29, [("走出国门开阔眼界，才不做井底之蛙。", "Zǒuchū guómén kāikuò yǎnjiè, cái bú zuò jǐngdǐzhīwā.", "Bước ra thế giới mở rộng tầm mắt mới không làm chú ếch ngồi đáy giếng.", "Go abroad to broaden horizons so as not to be a frog in a well.")]),
    ("杞人忧天", "杞人憂天", "qǐ rén yōu tiān", "qi ren you tian", "kỷ nhân ưu thiên", "Lo bò trắng răng, lo lắng hão huyền vô căn cứ", "Groundless worries, worry needlessly", "Thành ngữ", 21, [("事情远没那么糟，你这完全是杞人忧天。", "Shìqing yuǎn méi nàme zāo, nǐ zhè wánquán shì qǐrényōutiān.", "Sự việc còn lâu mới tệ đến mức đó, bạn hoàn toàn là lo bò trắng răng.", "The matter is far from bad, your concern is completely needless.")]),
    ("塞翁失马", "塞翁失馬", "sài wēng shī mǎ", "sai weng shi ma", "tái ông thất mã", "Tái ông mất ngựa, trong họa có phúc", "Blessing in disguise", "Thành ngữ", 37, [("塞翁失马，焉知非福，失去机会或许迎来新的转机。", "Sàiwēngshīmǎ, yān zhī fēi fú, shīqù jīhuì huòxǔ yínglái xīn de zhuǎnjī.", "Tái ông mất ngựa đâu biết không phải là phúc, mất cơ hội này có khi đón vận hội mới.", "A loss may turn out to be a blessing in disguise.")]),
    ("卧薪尝胆", "臥薪嘗膽", "wò xīn cháng dǎn", "wo xin chang dan", "ngọa tân thường đản", "Nếm mật nằm gai, chịu khổ rèn chí báo thù phục quốc", "Endure hardships patiently to accomplish ambition", "Thành ngữ", 50, [("经过十年卧薪尝胆，越王勾践最终反败为胜。", "Jīngguò shí nián wòxīnchángdǎn, Yuè Wáng Gōujiàn zuìzhōng fǎnbàiwéishèng.", "Trải qua mười năm nếm mật nằm gai, Việt Vương Câu Tiễn rốt cuộc chuyển bại thành thắng.", "Through ten years of enduring hardships, King Goujian finally turned defeat to victory.")]),
    ("负荆请罪", "負荊請罪", "fù jīng qǐng zuì", "fu jing qing zui", "phụ kinh thỉnh tội", "Mang gai chịu đòn xin lỗi, thành tâm nhận lỗi", "Offer humble apology, carry thorns to ask for punishment", "Thành ngữ", 38, [("廉颇深受感动，亲自登门负荆请罪。", "Lián Pō shēn shòu gǎndòng, qīnzì dēngmén fùjīngqǐngzuì.", "Liêm Pha vô cùng cảm động, đích thân đến tận cửa mang gai xin tạ tội.", "Lian Po was deeply touched, personally visiting to offer humble apology.")]),
    ("完璧归赵", "完璧歸趙", "wán bì guī zhào", "wan bi gui zhao", "hoàn bích quy Triệu", "Châu về Hợp Phố, trả lại nguyên vẹn đồ quý", "Return jade intact to Zhao, return unharmed", "Thành ngữ", 45, [("他历经千辛万苦，终于把国宝完璧归赵。", "Tā lìjīng qiānxīnwànkǔ, zhōngyú bǎ guóbǎo wánbìguīzhào.", "Trải qua muôn vàn gian khổ, ông rốt cuộc đã đưa quốc bảo trở về nguyên vẹn.", "After untold hardships, he finally returned the national treasure intact.")]),
    ("望洋兴叹", "望洋興嘆", "wàng yáng xīng tàn", "wang yang xing tan", "vọng dương hưng thán", "Trông biển thở dài, cảm thấy bất lực trước việc lớn", "Feel powerless before a vast task", "Thành ngữ", 42, [("面对浩繁的书目，初学者往往望洋兴叹。", "Miànduì hàofán de shūmù, chūxuézhě wǎngwǎng wàngyángxīngtàn.", "Trước danh mục sách mênh mông, người mới học thường chỉ biết nhìn biển thở dài.", "Facing a vast book catalogue, beginners often feel powerless.")]),
    ("一筹莫展", "一籌莫展", "yì chóu mò zhǎn", "yi chou mo zhan", "nhất trù mạc triển", "Bó tay hết cách, không nghĩ ra mưu kế nào", "At one's wits' end, at a complete loss", "Thành ngữ", 40, [("技术遇到瓶颈，整个攻关团队一度一筹莫展。", "Jìshù yù dào píngjǐng, zhěng gè gōngguān tuánduì yídù yìchóumòzhǎn.", "Công nghệ vấp phải nút thắt cổ chai, toàn bộ đội đặc nhiệm có lúc hoàn toàn bó tay.", "Technology hit a bottleneck, the whole task team was once at its wits' end.")]),
]

all_hsk6_raw = HSK6_RAW + EXTRA_HSK6
seen = set()
items = []
idx = 1
for row in all_hsk6_raw:
    simp, trad, py, clean, hv, vi, en, pos, strokes, exs = row
    if simp in seen:
        continue
    seen.add(simp)
    item = {
        "hsk_level": 6,
        "simplified": simp,
        "traditional": trad,
        "pinyin": py,
        "pinyin_clean": clean,
        "han_viet": hv,
        "meaning_vi": vi,
        "meaning_en": en,
        "part_of_speech": pos,
        "stroke_count": strokes,
        "frequency_rank": idx,
        "examples": [
            {"chinese": ex[0], "pinyin": ex[1], "meaning_vi": ex[2], "meaning_en": ex[3]}
            for ex in exs
        ]
    }
    items.append(item)
    idx += 1

print(f"Total Unique HSK 6: {len(items)}")
with open("/home/admin1/hskde/backend/app/data/hsk6_vocab.py", "w", encoding="utf-8") as f:
    f.write("# HSK 6 Authentic Vocabulary Dataset (84+ entries)\n")
    f.write("HSK6_VOCAB = ")
    f.write(pprint.pformat(items, indent=4, width=120, compact=False))
    f.write("\n")
print("Written /home/admin1/hskde/backend/app/data/hsk6_vocab.py successfully!")
