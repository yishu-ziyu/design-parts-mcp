import SwiftUI
import SwiftData

private enum Palette {
    static let paper = Color(red: 241.0 / 255, green: 234.0 / 255, blue: 221.0 / 255)
    static let card = Color(red: 1, green: 0.997, blue: 0.98)
    static let ink = Color(red: 0.20, green: 0.23, blue: 0.19)
    static let secondary = Color(red: 0.43, green: 0.46, blue: 0.39)
    static let accent = Color(red: 0.37, green: 0.43, blue: 0.31)
}

private enum WishTab: String, CaseIterable {
    case all = "想做的", month = "这个月", done = "已完成"
    var symbol: String {
        switch self {
        case .all: "tray"
        case .month: "circle.dotted"
        case .done: "checkmark.circle"
        }
    }
    var identifier: String {
        switch self { case .all: "tab_all"; case .month: "tab_month"; case .done: "tab_done" }
    }
}

private enum EditorRoute: Identifiable {
    case create
    case edit(Wish)
    var id: String {
        switch self { case .create: "create"; case .edit(let wish): wish.id.uuidString }
    }
}

struct WishlistView: View {
    @Environment(\.modelContext) private var context
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @Query(sort: \Wish.createdAt) private var wishes: [Wish]
    @State private var tab = WishTab.month
    @State private var editor: EditorRoute?
    @State private var saveError = false

    private var visibleWishes: [Wish] {
        wishes.filter { wish in
            switch tab {
            case .all: wish.completedAt == nil
            case .month: wish.completedAt == nil && wish.isThisMonth
            case .done: wish.completedAt != nil
            }
        }
    }

    var body: some View {
        GeometryReader { geometry in
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    header
                    if visibleWishes.isEmpty {
                        emptyState
                    } else {
                        LazyVStack(spacing: 16) {
                            ForEach(visibleWishes) { wish in
                                WishCard(wish: wish, edit: { editor = .edit(wish) }, complete: { toggleCompletion(wish) })
                            }
                        }
                    }
                }
                .frame(maxWidth: 700, alignment: .leading)
                .padding(.horizontal, geometry.size.width > 600 ? 40 : 22)
                .padding(.top, 34)
                .padding(.bottom, 28)
                .frame(maxWidth: .infinity)
            }
            .background(Palette.paper.ignoresSafeArea())
        }
        .safeAreaInset(edge: .bottom) { navigation }
        .foregroundStyle(Palette.ink)
        .sheet(item: $editor) { route in
            switch route {
            case .create: WishEditor(defaultThisMonth: tab == .month)
            case .edit(let wish): WishEditor(wish: wish)
            }
        }
        .alert("未能保存", isPresented: $saveError) {
            Button("知道了", role: .cancel) { }
        } message: { Text("这次修改没有保存，请重试。之前的数据没有清除。") }
    }

    private var header: some View {
        HStack(alignment: .center) {
            Text(tab == .month ? "\(Calendar.current.component(.month, from: Date()))月" : tab.rawValue)
                .font(.system(.largeTitle, design: .rounded, weight: .bold))
                .accessibilityAddTraits(.isHeader)
            Spacer()
            Button { editor = .create } label: {
                Image(systemName: "plus").font(.system(size: 21, weight: .medium))
                    .frame(width: 50, height: 50)
                    .background(Palette.card, in: Circle())
            }
            .buttonStyle(.plain)
            .accessibilityLabel("添加愿望")
            .accessibilityIdentifier("add_wish")
        }
        .padding(.bottom, 14)
    }

    private var emptyState: some View {
        VStack(spacing: 18) {
            Image("camping").resizable().scaledToFit().frame(width: 86, height: 86)
                .accessibilityHidden(true)
            Text(tab == .done ? "还没有已完成的愿望" : tab == .month ? "还没有本月计划" : "还没有愿望")
                .font(.system(size: 17, weight: .medium))
            if tab == .month && wishes.contains(where: { $0.completedAt == nil }) {
                Button("从想做的事里挑一件") { tab = .all }
                    .foregroundStyle(Palette.accent)
            } else if tab != .done {
                Button("添加愿望") { editor = .create }
                    .foregroundStyle(Palette.accent)
            }
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 90)
    }

    private var navigation: some View {
        HStack(spacing: 8) {
            ForEach(WishTab.allCases, id: \.self) { item in
                Button {
                    withAnimation(reduceMotion ? nil : .easeOut(duration: 0.18)) { tab = item }
                } label: {
                    VStack(spacing: 6) {
                        Image(systemName: item.symbol).font(.system(size: 21, weight: .regular))
                        Text(item.rawValue).font(.system(size: 12, weight: tab == item ? .semibold : .regular))
                    }
                    .frame(width: 84, height: 58)
                    .foregroundStyle(tab == item ? Palette.accent : Palette.secondary)
                    .background(tab == item ? Palette.paper.opacity(0.75) : .clear, in: RoundedRectangle(cornerRadius: 23))
                }
                .buttonStyle(.plain)
                .accessibilityIdentifier(item.identifier)
                .accessibilityAddTraits(tab == item ? .isSelected : [])
            }
        }
        .padding(8)
        .background(Palette.card.opacity(0.97), in: Capsule())
        .shadow(color: Palette.ink.opacity(0.06), radius: 14, y: 5)
        .padding(.bottom, 12)
        .frame(maxWidth: .infinity)
        .background(Palette.paper)
    }

    private func toggleCompletion(_ wish: Wish) {
        #if DEBUG
        // Falsify the real UI acceptance path without touching the production store.
        if ProcessInfo.processInfo.environment["SOMEDAY_BLOCK_COMPLETION"] == "1" { return }
        #endif
        wish.completedAt = wish.completedAt == nil ? Date() : nil
        do { try context.save() }
        catch { context.rollback(); saveError = true }
    }
}

private struct WishCard: View {
    let wish: Wish
    let edit: () -> Void
    let complete: () -> Void
    @ScaledMetric(relativeTo: .body) private var iconSize = 58

    var body: some View {
        HStack(alignment: .center, spacing: 20) {
            Button(action: edit) {
                HStack(spacing: 20) {
                    Image(wish.icon).resizable().scaledToFit()
                        .frame(width: iconSize - 12, height: iconSize - 12)
                        .frame(width: iconSize, height: iconSize)
                        .background(.white, in: Circle())
                        .shadow(color: Palette.ink.opacity(0.06), radius: 8, y: 4)
                        .accessibilityHidden(true)
                    VStack(alignment: .leading, spacing: 10) {
                        Text(wish.title).font(.title3.weight(.semibold))
                            .strikethrough(wish.completedAt != nil)
                            .foregroundStyle(wish.completedAt == nil ? Palette.ink : Palette.secondary)
                        if !wish.nextStep.isEmpty {
                            Text(wish.nextStep).font(.subheadline)
                                .foregroundStyle(Palette.secondary)
                        }
                    }
                    .fixedSize(horizontal: false, vertical: true)
                    Spacer(minLength: 0)
                }
                .contentShape(Rectangle())
            }
            .buttonStyle(.plain)
            .accessibilityIdentifier("wish_\(wish.id)")
            .accessibilityLabel(wish.title)
            .accessibilityValue(wish.nextStep)
            .accessibilityHint("编辑愿望和本月计划")
            Button(action: complete) {
                ZStack {
                    Circle().strokeBorder(Palette.secondary, lineWidth: 1.8)
                    if wish.completedAt != nil {
                        Circle().fill(Palette.accent)
                        Image(systemName: "checkmark").font(.system(size: 15, weight: .semibold)).foregroundStyle(.white)
                    }
                }
                .frame(width: 29, height: 29)
                .frame(width: 48, height: 48)
                .contentShape(Rectangle())
            }
            .buttonStyle(.plain)
            .accessibilityLabel(wish.completedAt == nil ? "完成：\(wish.title)" : "撤销完成：\(wish.title)")
            .accessibilityIdentifier("complete_\(wish.id)")
        }
        .padding(24)
        .frame(minHeight: 120)
        .background(Palette.card, in: RoundedRectangle(cornerRadius: 32, style: .continuous))
    }
}

private struct WishEditor: View {
    @Environment(\.modelContext) private var context
    @Environment(\.dismiss) private var dismiss
    let wish: Wish?
    @State private var title: String
    @State private var nextStep: String
    @State private var icon: String
    @State private var isThisMonth: Bool
    @State private var saveError = false
    @State private var confirmDelete = false

    init(wish: Wish? = nil, defaultThisMonth: Bool = false) {
        self.wish = wish
        _title = State(initialValue: wish?.title ?? "")
        _nextStep = State(initialValue: wish?.nextStep ?? "")
        _icon = State(initialValue: wish?.icon ?? WishIcon.camping.rawValue)
        _isThisMonth = State(initialValue: wish?.isThisMonth ?? defaultThisMonth)
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    VStack(alignment: .leading, spacing: 9) {
                        Text("愿望").font(.system(size: 14)).foregroundStyle(Palette.secondary)
                        TextField("比如，去海边看一次日出", text: $title, axis: .vertical)
                            .lineLimit(1...3)
                            .padding(16)
                            .background(Palette.card, in: RoundedRectangle(cornerRadius: 16))
                            .accessibilityIdentifier("wish_title")
                    }
                    VStack(alignment: .leading, spacing: 9) {
                        Text("下一步（选填）").font(.system(size: 14)).foregroundStyle(Palette.secondary)
                        TextField("比如，选一个周末", text: $nextStep, axis: .vertical)
                            .lineLimit(2...4)
                            .padding(16)
                            .background(Palette.card, in: RoundedRectangle(cornerRadius: 16))
                            .accessibilityIdentifier("wish_step")
                    }
                    HStack(spacing: 14) {
                        ForEach(WishIcon.allCases) { item in
                            Button { icon = item.rawValue } label: {
                                Image(item.rawValue).resizable().scaledToFit()
                                    .frame(width: 43, height: 43)
                                    .frame(width: 62, height: 62)
                                    .background(icon == item.rawValue ? Palette.card : .clear, in: RoundedRectangle(cornerRadius: 18))
                                    .overlay { RoundedRectangle(cornerRadius: 18).strokeBorder(icon == item.rawValue ? Palette.accent.opacity(0.4) : .clear) }
                            }
                            .buttonStyle(.plain)
                            .accessibilityLabel(item.label)
                            .accessibilityAddTraits(icon == item.rawValue ? .isSelected : [])
                        }
                    }
                    Toggle("加入本月", isOn: $isThisMonth)
                        .tint(Palette.accent)
                        .accessibilityIdentifier("wish_month")
                    if wish != nil {
                        Button("删除愿望", role: .destructive) { confirmDelete = true }
                            .padding(.top, 8)
                    }
                }
                .padding(26)
            }
            .background(Palette.paper.ignoresSafeArea())
            .foregroundStyle(Palette.ink)
            .navigationTitle(wish == nil ? "添加愿望" : "编辑愿望")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) { Button("取消") { dismiss() } }
                ToolbarItem(placement: .confirmationAction) {
                    Button(wish == nil ? "添加" : "保存") { save() }
                        .fontWeight(.semibold)
                        .disabled(title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                        .accessibilityIdentifier("save_wish")
                }
            }
            .tint(Palette.accent)
            .confirmationDialog("删除这个愿望？", isPresented: $confirmDelete, titleVisibility: .visible) {
                Button("删除", role: .destructive) {
                    if let wish { context.delete(wish) }
                    do { try context.save(); dismiss() }
                    catch { context.rollback(); saveError = true }
                }
            }
            .alert("未能保存", isPresented: $saveError) { Button("知道了", role: .cancel) { } }
                message: { Text("请重试。这次修改没有保存。") }
        }
        .presentationDetents([.large])
        .presentationDragIndicator(.visible)
    }

    private func save() {
        let cleanedTitle = title.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !cleanedTitle.isEmpty else { return }
        let savedWish = wish ?? Wish(title: cleanedTitle)
        savedWish.title = cleanedTitle
        savedWish.nextStep = nextStep.trimmingCharacters(in: .whitespacesAndNewlines)
        savedWish.icon = icon
        savedWish.isThisMonth = isThisMonth
        if wish == nil { context.insert(savedWish) }
        do { try context.save(); dismiss() }
        catch { context.rollback(); saveError = true }
    }
}
