import { createClient } from "@supabase/supabase-js";
import { NextApiRequest, NextApiResponse } from "next/dist/shared/lib/utils";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { syllabus, userId } = req.body; // syllabus is your parsed array

  try {
    for (const week of syllabus) {
      const { data: topicData, error: topicError } = await supabase
        .from("topics")
        .insert({
          user_id: userId,
          week: week.week,
          topic: week.topic,
        })
        .select()
        .single();

      if (topicError) throw topicError;

      if (week.due_items?.length > 0) {
        const dueItems = week.due_items.map(
          (item: { title: string; due_date: string }) => ({
            topic_id: topicData.id,
            title: item.title,
            due_date: item.due_date,
          })
        );
        await supabase.from("due_items").insert(dueItems);
      }
    }

    res.status(200).json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
