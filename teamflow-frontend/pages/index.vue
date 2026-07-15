<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <!-- Nav (unchanged) -->
    <header
      :class="
        scrolled
          ? 'border-slate-200 bg-white/90 backdrop-blur-md shadow-sm'
          : 'border-transparent bg-slate-50/60 backdrop-blur-sm'
      "
      class="sticky top-0 z-40 border-b transition-colors duration-300"
    >
      <div
        class="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6"
      >
        <div class="flex items-center gap-2.5">
          <img
            alt="TeamFlow logo"
            class="h-9 w-9 rounded-xl object-contain"
            src="/teamflow_logo.svg"
          />
          <span class="font-display text-lg font-bold tracking-tight"
            >TeamFlow</span
          >
        </div>

        <nav
          class="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex"
        >
          <a class="transition hover:text-slate-900" href="#features"
            >Features</a
          >
          <a class="transition hover:text-slate-900" href="#tour"
            >Product tour</a
          >
          <a class="transition hover:text-slate-900" href="#how-it-works"
            >How it works</a
          >
          <a class="transition hover:text-slate-900" href="#faq">FAQ</a>
        </nav>

        <div class="hidden items-center gap-3 md:flex">
          <NuxtLink
            class="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            to="/login"
          >
            Sign in
          </NuxtLink>
          <NuxtLink
            class="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:shadow-lg hover:shadow-indigo-300"
            to="/register"
          >
            Get started free
          </NuxtLink>
        </div>

        <!-- Mobile hamburger -->
        <button
          class="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 md:hidden"
          @click="mobileMenuOpen = true"
        >
          <svg
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M4 6h16M4 12h16M4 18h16"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
            />
          </svg>
        </button>
      </div>
    </header>

    <!-- Mobile bottom sheet menu (unchanged) -->
    <Teleport to="body">
      <Transition name="sheet-backdrop">
        <div
          v-if="mobileMenuOpen"
          class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
          @click.self="mobileMenuOpen = false"
        />
      </Transition>

      <Transition name="sheet-panel">
        <div
          v-if="mobileMenuOpen"
          class="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl border-t border-slate-200 bg-white px-5 pb-8 pt-3 shadow-2xl md:hidden"
        >
          <div class="mx-auto mb-4 h-1.5 w-10 rounded-full bg-slate-200" />
          <div class="mb-2 flex items-center justify-between">
            <span class="font-display text-base font-bold">Menu</span>
            <button
              class="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              @click="mobileMenuOpen = false"
            >
              <svg
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M6 18L18 6M6 6l12 12"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                />
              </svg>
            </button>
          </div>

          <nav class="flex flex-col gap-1 text-base font-medium text-slate-700">
            <a
              class="rounded-xl px-3 py-3 hover:bg-slate-50"
              href="#features"
              @click="mobileMenuOpen = false"
              >Features</a
            >
            <a
              class="rounded-xl px-3 py-3 hover:bg-slate-50"
              href="#tour"
              @click="mobileMenuOpen = false"
              >Product tour</a
            >
            <a
              class="rounded-xl px-3 py-3 hover:bg-slate-50"
              href="#how-it-works"
              @click="mobileMenuOpen = false"
              >How it works</a
            >
            <a
              class="rounded-xl px-3 py-3 hover:bg-slate-50"
              href="#faq"
              @click="mobileMenuOpen = false"
              >FAQ</a
            >
          </nav>

          <div
            class="mt-3 flex flex-col gap-2.5 border-t border-slate-100 pt-4"
          >
            <NuxtLink
              class="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700"
              to="/login"
              @click="mobileMenuOpen = false"
            >
              Sign in
            </NuxtLink>
            <NuxtLink
              class="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-md shadow-indigo-200"
              to="/register"
              @click="mobileMenuOpen = false"
            >
              Get started free
            </NuxtLink>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Hero -->
    <section
      class="relative overflow-hidden mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-28"
    >
      <!-- Hero Background Images -->
      <!-- Desktop background: hidden on mobile, shown on md+ -->
      <img
        alt="TeamFlow background desktop"
        class="absolute inset-0 z-0 hidden h-full w-full object-cover opacity-50 md:block"
        src="/herobg.svg"
      />
      <!-- Mobile background: shown on mobile, hidden on md+ -->
      <img
        alt="TeamFlow background mobile"
        class="absolute inset-0 z-0 block h-full w-full object-cover opacity-30 md:hidden"
        src="/herobg_mobile.svg"
      />

      <!-- Hero content (unchanged but with relative z-index) -->
      <div class="relative z-10">
        <span
          v-motion
          :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
          :initial="{ opacity: 0, y: 16 }"
          class="font-mono-label inline-block rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium uppercase tracking-wider text-indigo-700"
        >
          Project management, without the chaos
        </span>

        <h1
          v-motion
          :enter="{
            opacity: 1,
            y: 0,
            transition: { duration: 600, delay: 80 },
          }"
          :initial="{ opacity: 0, y: 24 }"
          class="font-display mt-6 text-3xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-[3.25rem]"
        >
          Plan the work.
          <br />
          See it move.
        </h1>

        <p
          v-motion
          :enter="{
            opacity: 1,
            y: 0,
            transition: { duration: 600, delay: 160 },
          }"
          :initial="{ opacity: 0, y: 24 }"
          class="mt-6 max-w-md text-base leading-relaxed text-slate-600 sm:text-lg"
        >
          TeamFlow gives your team one place to organize workspaces, break
          projects into tasks, and watch progress happen in real time — from
          first idea to done.
        </p>

        <div
          v-motion
          :enter="{
            opacity: 1,
            y: 0,
            transition: { duration: 600, delay: 240 },
          }"
          :initial="{ opacity: 0, y: 24 }"
          class="mt-8 flex flex-wrap items-center gap-4"
        >
          <NuxtLink
            class="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-300"
            to="/register"
          >
            Get started free
          </NuxtLink>
          <NuxtLink
            class="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
            to="/login"
          >
            Sign in
          </NuxtLink>
        </div>

        <p class="mt-4 text-sm text-slate-400">
          No credit card. Set up your first workspace in under a minute.
        </p>
      </div>

      <!-- Signature element: live-feeling mini kanban board (unchanged) -->
      <div
        v-motion
        :enter="{
          opacity: 1,
          scale: 1,
          transition: { duration: 700, delay: 200 },
        }"
        :initial="{ opacity: 0, scale: 0.94 }"
        class="relative z-10"
      >
        <div
          class="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/70 p-4 shadow-xl shadow-slate-200/60 backdrop-blur-xl sm:p-5"
        >
          <div class="mb-4 flex items-center justify-between">
            <span
              class="font-mono-label text-xs font-medium uppercase tracking-wider text-slate-400"
              >Board preview</span
            >
            <span class="flex items-center gap-1.5 text-xs text-slate-400">
              <span
                class="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"
              />
              Live
            </span>
          </div>

          <div class="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <div
              v-for="col in previewColumns"
              :key="col.label"
              :class="col.wrapper"
              class="rounded-xl border p-2.5"
            >
              <div class="mb-2 flex items-center gap-1.5">
                <span :class="col.dot" class="h-1.5 w-1.5 rounded-full" />
                <span class="text-[10px] font-semibold text-slate-500">{{
                  col.label
                }}</span>
              </div>

              <div
                v-for="card in col.cards"
                :key="card"
                class="mb-1.5 rounded-lg border border-slate-100 bg-white px-2 py-2 text-[10px] font-medium text-slate-600 shadow-sm last:mb-0"
              >
                {{ card }}
              </div>
            </div>
          </div>

          <div
            class="flow-card pointer-events-none absolute top-[86px] hidden w-[21%] rounded-lg border border-indigo-200 bg-white px-2 py-2 text-[10px] font-semibold text-indigo-700 shadow-md sm:block sm:top-[74px]"
          >
            Ship v2 release
          </div>
        </div>

        <div
          class="absolute -bottom-6 -right-6 -z-10 h-40 w-40 rounded-full bg-purple-200/40 blur-3xl"
        />
        <div
          class="absolute -left-8 -top-8 -z-10 h-32 w-32 rounded-full bg-indigo-200/40 blur-3xl"
        />
      </div>
    </section>

    <!-- Features (unchanged) -->
    <section
      id="features"
      class="mx-auto max-w-6xl scroll-mt-20 px-6 py-16 sm:px-6 sm:py-20"
    >
      <div class="max-w-xl">
        <span
          class="font-mono-label text-xs font-medium uppercase tracking-wider text-indigo-600"
          >What's inside</span
        >
        <h2
          class="font-display mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl"
        >
          Everything a team needs, nothing it doesn't.
        </h2>
      </div>

      <div class="mt-10 grid gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(feature, i) in features"
          :key="feature.title"
          v-motion
          :initial="{ opacity: 0, y: 28 }"
          :visible-once="{
            opacity: 1,
            y: 0,
            transition: { duration: 500, delay: i * 90 },
          }"
          class="rounded-3xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-slate-200/50"
        >
          <div
            :class="feature.iconBg"
            class="flex h-11 w-11 items-center justify-center rounded-xl"
          >
            <component
              :is="feature.icon"
              :class="feature.iconColor"
              class="h-5 w-5"
            />
          </div>
          <h3 class="mt-4 text-base font-semibold text-slate-900">
            {{ feature.title }}
          </h3>
          <p class="mt-1.5 text-sm leading-relaxed text-slate-500">
            {{ feature.description }}
          </p>
        </div>
      </div>
    </section>

    <!-- Product tour -->
    <section
      id="tour"
      class="relative overflow-hidden border-y border-slate-200 bg-white px-5"
    >
      <!-- Corner decoration images -->
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <!-- Top-left image -->
        <img
          alt=""
          aria-hidden="true"
          class="absolute -left-12 -top-12 w-48 opacity-40 sm:w-64 lg:w-80"
          src="/tour-deco-top-left.svg"
        />
        <!-- Bottom-right image -->
        <img
          alt=""
          aria-hidden="true"
          class="absolute -bottom-12 -right-12 w-48 opacity-40 sm:w-64 lg:w-80"
          src="/tour-deco-bottom-right.svg"
        />
      </div>

      <div
        class="relative z-10 mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20"
      >
        <div class="max-w-xl">
          <span
            class="font-mono-label text-xs font-medium uppercase tracking-wider text-indigo-600"
            >See it in action</span
          >
          <h2
            class="font-display mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl"
          >
            One tool, every part of the work.
          </h2>
        </div>

        <div class="mt-8 flex flex-wrap gap-2 sm:mt-10">
          <button
            v-for="(tab, i) in tourTabs"
            :key="tab.label"
            :class="
              activeTab === i
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            "
            class="rounded-full px-4 py-2 text-sm font-medium transition"
            @click="activeTab = i"
          >
            {{ tab.label }}
          </button>
        </div>

        <div
          class="relative mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50/60 p-5 backdrop-blur-sm sm:mt-8 sm:p-8"
        >
          <Transition mode="out-in" name="tour-fade">
            <div
              :key="activeTab"
              class="grid gap-6 lg:grid-cols-2 lg:items-center lg:gap-8"
            >
              <div>
                <h3 class="text-lg font-semibold text-slate-900 sm:text-xl">
                  {{ tourTabs[activeTab].title }}
                </h3>
                <p class="mt-3 text-sm leading-relaxed text-slate-500">
                  {{ tourTabs[activeTab].description }}
                </p>
              </div>
              <div
                class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <component :is="tourTabs[activeTab].mock" />
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </section>

    <!-- How it works (unchanged) -->
    <section
      id="how-it-works"
      class="mx-auto max-w-6xl scroll-mt-20 px-7 py-16 sm:px-6 sm:py-20"
    >
      <div class="max-w-xl">
        <span
          class="font-mono-label text-xs font-medium uppercase tracking-wider text-indigo-600"
          >Getting started</span
        >
        <h2
          class="font-display mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl"
        >
          Three steps to your first task board.
        </h2>
      </div>

      <div class="mt-10 grid gap-10 sm:mt-12 sm:grid-cols-3">
        <div
          v-for="(step, i) in steps"
          :key="step.number"
          v-motion
          :initial="{ opacity: 0, y: 24 }"
          :visible-once="{
            opacity: 1,
            y: 0,
            transition: { duration: 500, delay: i * 120 },
          }"
        >
          <span class="font-mono-label text-sm font-semibold text-indigo-300">{{
            step.number
          }}</span>
          <h3 class="mt-3 text-lg font-semibold text-slate-900">
            {{ step.title }}
          </h3>
          <p class="mt-2 text-sm leading-relaxed text-slate-500">
            {{ step.description }}
          </p>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section
      id="faq"
      class="relative overflow-hidden border-t border-slate-200 bg-white"
    >
      <!-- Background decorations -->
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <!-- Top-left blob -->
        <div
          class="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-400/80 blur-3xl"
        />
        <!-- Bottom-right blob -->
        <div
          class="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-purple-600/50 blur-3xl"
        />
        <!-- Subtle center-left accent -->
        <div
          class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-yellow-500/40 blur-2xl"
        />
      </div>

      <div
        class="relative z-10 mx-auto max-w-3xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20"
      >
        <div class="text-center">
          <span
            class="font-mono-label text-xs font-medium uppercase tracking-wider text-indigo-600"
            >Questions</span
          >
          <h2
            class="font-display mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
          >
            Good to know.
          </h2>
        </div>

        <div
          class="relative mt-8 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm sm:mt-10"
        >
          <div v-for="(item, i) in faqs" :key="item.q">
            <button
              class="flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-6 sm:py-5"
              @click="openFaq = openFaq === i ? null : i"
            >
              <span class="text-sm font-semibold text-slate-800">{{
                item.q
              }}</span>
              <svg
                :class="openFaq === i ? 'rotate-45' : ''"
                class="h-4 w-4 shrink-0 text-slate-400 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 4v16m8-8H4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
            </button>

            <div
              :style="{ gridTemplateRows: openFaq === i ? '1fr' : '0fr' }"
              class="grid transition-all duration-300 ease-in-out"
            >
              <div class="overflow-hidden">
                <p
                  class="px-4 pb-4 text-sm leading-relaxed text-slate-500 sm:px-6 sm:pb-5"
                >
                  {{ item.a }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA banner (unchanged) -->
    <section class="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-20">
      <div
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 600 } }"
        class="rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-12 text-center shadow-xl shadow-indigo-200 sm:px-16 sm:py-14"
      >
        <h2
          class="font-display text-2xl font-bold text-white sm:text-3xl md:text-4xl"
        >
          Bring your team into flow.
        </h2>
        <p class="mx-auto mt-4 max-w-md text-indigo-100">
          Create a workspace, invite your team, and start moving work forward
          today.
        </p>
        <NuxtLink
          class="mt-8 inline-block rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-indigo-700 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
          to="/register"
        >
          Get started free
        </NuxtLink>
      </div>
    </section>

    <footer class="border-t border-slate-200 bg-white">
      <div class="mx-auto max-w-6xl px-5 py-12 sm:px-6 lg:py-16">
        <!-- Main footer grid -->
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <!-- Brand column -->
          <div class="sm:col-span-2 lg:col-span-1">
            <div class="flex items-center gap-2.5">
              <img
                alt="TeamFlow logo"
                class="h-9 w-9 rounded-xl object-contain"
                src="/teamflow_logo.svg"
              />
              <span
                class="font-display text-lg font-bold tracking-tight text-slate-900"
                >TeamFlow</span
              >
            </div>
            <p class="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
              One place to organize workspaces, break projects into tasks, and
              watch progress happen in real time.
            </p>
            <!-- Social links -->
            <div class="mt-6 flex gap-4">
              <a
                aria-label="GitHub"
                class="text-slate-400 transition hover:text-slate-600"
                href="#"
              >
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.123-.3-.535-1.52.117-3.16 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.399 3-.399s2.04.132 3 .399c2.292-1.552 3.3-1.23 3.3-1.23.653 1.64.24 2.86.118 3.16.768.84 1.233 1.91 1.233 3.22 0 4.61-2.804 5.62-5.476 5.92.43.37.824 1.102.824 2.22 0 1.602-.015 2.894-.015 3.287 0 .322.216.694.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                  />
                </svg>
              </a>
              <a
                aria-label="Twitter"
                class="text-slate-400 transition hover:text-slate-600"
                href="#"
              >
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                  />
                </svg>
              </a>
              <a
                aria-label="LinkedIn"
                class="text-slate-400 transition hover:text-slate-600"
                href="#"
              >
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                  />
                </svg>
              </a>
              <a
                aria-label="YouTube"
                class="text-slate-400 transition hover:text-slate-600"
                href="#"
              >
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                  />
                </svg>
              </a>
            </div>
          </div>

          <!-- Product links -->
          <div>
            <h3
              class="text-sm font-semibold uppercase tracking-wider text-slate-900"
            >
              Product
            </h3>
            <ul class="mt-4 space-y-2.5">
              <li>
                <a
                  class="text-sm text-slate-500 transition hover:text-slate-900"
                  href="#features"
                  >Features</a
                >
              </li>
              <li>
                <a
                  class="text-sm text-slate-500 transition hover:text-slate-900"
                  href="#tour"
                  >Product tour</a
                >
              </li>
              <li>
                <a
                  class="text-sm text-slate-500 transition hover:text-slate-900"
                  href="#how-it-works"
                  >How it works</a
                >
              </li>
              <li>
                <a
                  class="text-sm text-slate-500 transition hover:text-slate-900"
                  href="#faq"
                  >FAQ</a
                >
              </li>
            </ul>
          </div>

          <!-- Company links -->
          <div>
            <h3
              class="text-sm font-semibold uppercase tracking-wider text-slate-900"
            >
              Company
            </h3>
            <ul class="mt-4 space-y-2.5">
              <li>
                <NuxtLink
                  class="text-sm text-slate-500 transition hover:text-slate-900"
                  to="/about"
                  >About</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  class="text-sm text-slate-500 transition hover:text-slate-900"
                  to="/blog"
                  >Blog</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  class="text-sm text-slate-500 transition hover:text-slate-900"
                  to="/careers"
                  >Careers</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  class="text-sm text-slate-500 transition hover:text-slate-900"
                  to="/press"
                  >Press</NuxtLink
                >
              </li>
            </ul>
          </div>

          <!-- Support & Legal -->
          <div>
            <h3
              class="text-sm font-semibold uppercase tracking-wider text-slate-900"
            >
              Support
            </h3>
            <ul class="mt-4 space-y-2.5">
              <li>
                <NuxtLink
                  class="text-sm text-slate-500 transition hover:text-slate-900"
                  to="/help"
                  >Help center</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  class="text-sm text-slate-500 transition hover:text-slate-900"
                  to="/contact"
                  >Contact</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  class="text-sm text-slate-500 transition hover:text-slate-900"
                  to="/privacy"
                  >Privacy</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  class="text-sm text-slate-500 transition hover:text-slate-900"
                  to="/terms"
                  >Terms</NuxtLink
                >
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom bar with copyright and legal links -->
        <div
          class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 text-sm text-slate-400 sm:flex-row"
        >
          <span>© {{ year }} TeamFlow. All rights reserved.</span>
          <div class="flex items-center gap-6">
            <NuxtLink class="transition hover:text-slate-600" to="/privacy"
              >Privacy</NuxtLink
            >
            <NuxtLink class="transition hover:text-slate-600" to="/terms"
              >Terms</NuxtLink
            >
            <NuxtLink class="transition hover:text-slate-600" to="/cookies"
              >Cookies</NuxtLink
            >
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { h, ref, onMounted, onUnmounted, watch } from "vue";
import {
  FolderKanban,
  CheckSquare,
  MessageSquare,
  Paperclip,
  Bell,
  ShieldCheck,
} from "lucide-vue-next";

useHead({
  link: [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=JetBrains+Mono:wght@500&display=swap",
    },
  ],
});

const authStore = useAuthStore();

onMounted(() => {
  authStore.initializeAuth();
  if (authStore.token) {
    navigateTo("/dashboard");
  }
});

const year = new Date().getFullYear();

const mobileMenuOpen = ref(false);

watch(mobileMenuOpen, (open) => {
  if (import.meta.client) {
    document.body.style.overflow = open ? "hidden" : "";
  }
});

const scrolled = ref(false);
function onScroll() {
  scrolled.value = window.scrollY > 12;
}
onMounted(() => window.addEventListener("scroll", onScroll, { passive: true }));
onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
  if (import.meta.client) document.body.style.overflow = "";
});

const previewColumns = [
  {
    label: "To Do",
    wrapper: "border-slate-200 bg-slate-50/60",
    dot: "bg-slate-400",
    cards: ["Design landing page", "Fix login bug"],
  },
  {
    label: "In Progress",
    wrapper: "border-blue-100 bg-blue-50/40",
    dot: "bg-blue-500",
    cards: ["API integration"],
  },
  {
    label: "Review",
    wrapper: "border-purple-100 bg-purple-50/40",
    dot: "bg-purple-500",
    cards: [],
  },
  {
    label: "Done",
    wrapper: "border-emerald-100 bg-emerald-50/40",
    dot: "bg-emerald-500",
    cards: ["Set up workspace"],
  },
];

const features = [
  {
    title: "Workspaces for every team",
    description:
      "Keep each team's projects, members, and activity in their own dedicated space.",
    icon: ShieldCheck,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
  {
    title: "Projects, clearly organized",
    description:
      "Group related work into projects so nothing gets lost between teams.",
    icon: FolderKanban,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    title: "A board that shows progress",
    description:
      "Move tasks across To Do, In Progress, Review, and Done — see status at a glance.",
    icon: CheckSquare,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    title: "Comments where the work is",
    description:
      "Discuss a task right on the task — no separate thread to keep track of.",
    icon: MessageSquare,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    title: "Files, attached directly",
    description:
      "Drop specs, screenshots, or designs onto the task they belong to.",
    icon: Paperclip,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    title: "Updates the moment they happen",
    description:
      "Get notified instantly when you're assigned, mentioned, or invited.",
    icon: Bell,
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
  },
];

const steps = [
  {
    number: "01",
    title: "Create a workspace",
    description:
      "Set up a home for your team in seconds — no setup wizard, no waiting.",
  },
  {
    number: "02",
    title: "Invite your team",
    description:
      "Bring people in with a role that matches what they need to do.",
  },
  {
    number: "03",
    title: "Plan, track, ship",
    description:
      "Break projects into tasks, move them across the board, and stay in sync.",
  },
];

const BoardMock = () =>
  h("div", { class: "space-y-2" }, [
    h(
      "div",
      {
        class: "flex items-center gap-2 rounded-lg border border-slate-100 p-3",
      },
      [
        h("span", { class: "h-2 w-2 rounded-full bg-blue-500" }),
        h(
          "span",
          { class: "text-sm font-medium text-slate-700" },
          "Implement login API",
        ),
        h(
          "span",
          {
            class:
              "ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700",
          },
          "HIGH",
        ),
      ],
    ),
    h(
      "div",
      {
        class: "flex items-center gap-2 rounded-lg border border-slate-100 p-3",
      },
      [
        h("span", { class: "h-2 w-2 rounded-full bg-purple-500" }),
        h(
          "span",
          { class: "text-sm font-medium text-slate-700" },
          "Design onboarding flow",
        ),
        h(
          "span",
          {
            class:
              "ml-auto rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700",
          },
          "MEDIUM",
        ),
      ],
    ),
  ]);

const CommentsMock = () =>
  h("div", { class: "space-y-3" }, [
    h("div", { class: "flex gap-2" }, [
      h(
        "div",
        {
          class:
            "flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700",
        },
        "J",
      ),
      h(
        "div",
        {
          class:
            "flex-1 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600",
        },
        "Backend's ready for review — pushed the auth guard fix.",
      ),
    ]),
    h("div", { class: "flex gap-2" }, [
      h(
        "div",
        {
          class:
            "flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 text-xs font-semibold text-purple-700",
        },
        "S",
      ),
      h(
        "div",
        {
          class:
            "flex-1 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600",
        },
        "Nice, testing it now 👍",
      ),
    ]),
  ]);

const NotificationsMock = () =>
  h("div", { class: "space-y-2" }, [
    h(
      "div",
      {
        class: "flex items-start gap-3 rounded-lg border border-slate-100 p-3",
      },
      [
        h("span", { class: "mt-1 h-2 w-2 rounded-full bg-indigo-500" }),
        h("div", null, [
          h("p", { class: "text-sm text-slate-700" }, [
            h("span", { class: "font-medium" }, "You"),
            ' were assigned to "Set up Docker"',
          ]),
          h("p", { class: "text-xs text-slate-400" }, "2m ago"),
        ]),
      ],
    ),
    h(
      "div",
      {
        class: "flex items-start gap-3 rounded-lg border border-slate-100 p-3",
      },
      [
        h("span", { class: "mt-1 h-2 w-2 rounded-full bg-transparent" }),
        h("div", null, [
          h(
            "p",
            { class: "text-sm text-slate-700" },
            'New comment on "Fix login bug"',
          ),
          h("p", { class: "text-xs text-slate-400" }, "1h ago"),
        ]),
      ],
    ),
  ]);

const activeTab = ref(0);
const tourTabs = [
  {
    label: "Board",
    title: "A board that always shows where things stand.",
    description:
      "Drag work across To Do, In Progress, Review, and Done. Priority and due dates are visible without opening a single task.",
    mock: BoardMock,
  },
  {
    label: "Comments",
    title: "Discussion lives on the task itself.",
    description:
      "No separate chat thread to dig through — feedback and decisions stay attached to the work they're about.",
    mock: CommentsMock,
  },
  {
    label: "Notifications",
    title: "Know the moment something needs you.",
    description:
      "Assignments, comments, and status changes arrive in real time, so nothing sits unnoticed.",
    mock: NotificationsMock,
  },
];

const openFaq = ref<number | null>(0);
const faqs = [
  {
    q: "Is my workspace's data visible to other workspaces?",
    a: "No. Every project, task, and comment is scoped to its workspace — you only see data for workspaces you're an accepted member of.",
  },
  {
    q: "Do updates require a page refresh?",
    a: "No. Comments, task changes, and invitations are delivered in real time the moment they happen.",
  },
  {
    q: "What roles can I assign teammates?",
    a: "Admin, Manager, or Member — each with different permissions for managing projects, tasks, and other members.",
  },
  {
    q: "Does someone have to accept an invitation to join?",
    a: "Yes. Invitations are pending until the invited person explicitly accepts, so no one is added to a workspace without their consent.",
  },
  {
    q: "Is there a file size limit for attachments?",
    a: "Yes, attachments are capped at 10MB per file to keep things fast for everyone in the workspace.",
  },
];
</script>

<style>
html {
  scroll-behavior: smooth;
}
</style>

<style scoped>
.font-display {
  font-family: "Sora", ui-sans-serif, sans-serif;
}
.font-mono-label {
  font-family: "JetBrains Mono", ui-monospace, monospace;
}

.flow-card {
  left: 4%;
  opacity: 0;
  animation: flowAcross 9s ease-in-out infinite;
}

@keyframes flowAcross {
  0% {
    left: 4%;
    opacity: 0;
  }
  3% {
    opacity: 1;
  }
  13% {
    left: 4%;
    opacity: 1;
  }
  19% {
    opacity: 0;
  }
  24% {
    left: 28.5%;
    opacity: 0;
  }
  27% {
    opacity: 1;
  }
  40% {
    left: 28.5%;
    opacity: 1;
  }
  46% {
    opacity: 0;
  }
  51% {
    left: 53%;
    opacity: 0;
  }
  54% {
    opacity: 1;
  }
  67% {
    left: 53%;
    opacity: 1;
  }
  73% {
    opacity: 0;
  }
  78% {
    left: 77.5%;
    opacity: 0;
  }
  81% {
    opacity: 1;
  }
  97% {
    left: 77.5%;
    opacity: 1;
  }
  100% {
    left: 77.5%;
    opacity: 0;
  }
}

.tour-fade-enter-active,
.tour-fade-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}
.tour-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.tour-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Bottom sheet backdrop */
.sheet-backdrop-enter-active,
.sheet-backdrop-leave-active {
  transition: opacity 0.25s ease;
}
.sheet-backdrop-enter-from,
.sheet-backdrop-leave-to {
  opacity: 0;
}

/* Bottom sheet panel: slides up from below the viewport */
.sheet-panel-enter-active {
  transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);
}
.sheet-panel-leave-active {
  transition: transform 0.22s ease-in;
}
.sheet-panel-enter-from,
.sheet-panel-leave-to {
  transform: translateY(100%);
}

@media (prefers-reduced-motion: reduce) {
  .flow-card {
    animation: none;
    opacity: 1;
    left: 4%;
  }
  html {
    scroll-behavior: auto;
  }
  .sheet-panel-enter-active,
  .sheet-panel-leave-active {
    transition: none;
  }
}

/* Additional mobile responsiveness tweaks */
@media (max-width: 640px) {
  .hero h1 {
    font-size: 2.25rem; /* 36px */
  }
  .hero p {
    font-size: 1rem;
  }
  .flow-card {
    display: none !important;
  }
}
</style>
