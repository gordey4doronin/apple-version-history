use std::{env, fs, time::Instant};

mod rss;

fn main() {
    let start = Instant::now();
    println!("Pulling from RSS");

    // Temporary: reads RSS from a file, until fetching over HTTP is ported.
    let path = env::args().nth(1).expect("usage: pull-rss <file.rss>");
    let xml = fs::read_to_string(&path).expect("could not read RSS file");

    for item in rss::parse_rss_items(&xml) {
        println!("{} | {}", item.pub_date, item.title);
    }

    println!("Finished after {} seconds", start.elapsed().as_secs_f64());
}
