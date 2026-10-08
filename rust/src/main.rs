use std::time::Instant;

fn main() {
    let start = Instant::now();
    println!("Pulling from RSS");

    println!("Finished after {} seconds", start.elapsed().as_secs_f64());
}
