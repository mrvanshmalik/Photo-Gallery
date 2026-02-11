const SUPABASE_URL = "https://qzieszwlinxpmqhyvppy.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_9P6MVrb44lk4UTt5HpEfEw_yAw8gOvX";

if (!window.supabase) {
  console.error(
    "Supabase CDN load nahi hua. HTML me index.js se pehle ye lagao:\n" +
      '<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>',
  );
}

const db = window.supabase
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

const add = document.getElementById("btn-1");
const exit = document.getElementById("exit");
const form = document.getElementById("Add-photo");
const form_1 = document.getElementById("form");

const content = document.getElementById("content");

let list_photo = [];

function AddPhoto() {
  form.classList.remove("hidden");
}

add.addEventListener("click", AddPhoto);

exit.addEventListener("click", () => {
  form.classList.add("hidden");
  form_1.reset();
});

async function loadPhotos() {
  const { data, error } = await db
    .from("photos")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error(error);
    return;
  }

  data.forEach((item) => {
    const image = document.createElement("img");
    image.src = item.url;
    image.alt = item.name;
    image.className = "img-primery";
    content.append(image);
  });
}

if (db) loadPhotos();

form_1.addEventListener("submit", async (e) => {
  e.preventDefault();

  const input_img = document.getElementById("img-name").value.trim();
  const input_val = document.getElementById("url-id").value.trim();

  if (!input_img || !input_val) return;

  if (!db) {
    console.error("DB not connected (Supabase CDN missing).");
    return;
  }

  const { error } = await db.from("photos").insert({
    name: input_img,
    url: input_val,
  });

  if (error) {
    console.error(error);
    return;
  }

  const image = document.createElement("img");
  image.src = input_val;
  image.alt = input_img;
  image.className = "img-primery";
  content.append(image);

  form_1.reset();
  form.classList.add("hidden");
});

form.classList.add("hidden");
